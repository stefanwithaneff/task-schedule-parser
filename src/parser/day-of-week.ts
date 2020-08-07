import Parsimmon from "parsimmon";
import { NoopAtom } from "../schedule-atoms/base";
import { OrAtom } from "../schedule-atoms/combinators";
import {
  DayOfWeekValueAtom,
  DayOfWeekRangeAtom,
  LastDayOfWeekAtom,
  NthDayOfWeekAtom,
} from "../schedule-atoms/day-of-week";

const DayOfWeekRegex = Parsimmon.regexp(/\d/);

const DayOfWeekWildcard = Parsimmon.string("*").map(
  () => new DayOfWeekRangeAtom(0, 6)
);

const DayOfWeekValue = DayOfWeekRegex.map(
  (value) => new DayOfWeekValueAtom(Number(value))
);

const LastDayOfWeek = Parsimmon.seq(DayOfWeekValue, Parsimmon.string("L")).map(
  ([atom, _]) => new LastDayOfWeekAtom(atom)
);

const DayOfWeekOrdinalRegex = Parsimmon.regexp(/\d/);

const NthDayOfWeek = Parsimmon.seq(
  DayOfWeekValue,
  Parsimmon.string("#"),
  DayOfWeekOrdinalRegex
).map(([atom, _, ordinal]) => new NthDayOfWeekAtom(atom, Number(ordinal)));

const DayOfWeekRange = Parsimmon.seq(
  DayOfWeekValue,
  Parsimmon.string("-"),
  DayOfWeekValue
).map(([min, _, max]) => new DayOfWeekRangeAtom(min, max));

const DayOfWeekRangeOrValue = Parsimmon.alt(
  DayOfWeekRange,
  NthDayOfWeek,
  LastDayOfWeek,
  DayOfWeekValue
);

const DayOfWeekList = DayOfWeekRangeOrValue.sepBy(
  Parsimmon.string(",")
).map((atoms) => (atoms.length === 1 ? atoms : new OrAtom(atoms)));

const Blank = Parsimmon.string("?").map(() => new NoopAtom());

export const DayOfWeek = Parsimmon.alt(
  DayOfWeekWildcard,
  Blank,
  DayOfWeekList,
  DayOfWeekRangeOrValue
);
