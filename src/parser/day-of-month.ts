import Parsimmon from "parsimmon";
import { NoopAtom } from "../schedule-atoms/base";
import { OrAtom } from "../schedule-atoms/combinators";
import {
  DayOfMonthValueAtom,
  DayOfMonthRangeAtom,
  DayOfMonthWeekdayAtom,
  LastDayOfMonthAtom,
} from "../schedule-atoms/day-of-month";

const DayOfMonthRegex = Parsimmon.regexp(/\d?\d/);

const DayOfMonthWildcard = Parsimmon.string("*").map(
  () => new DayOfMonthRangeAtom(1, 31)
);

const DayOfMonthSteppedWildcard = Parsimmon.seq(
  DayOfMonthWildcard,
  Parsimmon.string("/"),
  DayOfMonthRegex
).map(
  ([range, _, step]) =>
    new DayOfMonthRangeAtom(range.min, range.max, Number(step))
);

const DayOfMonthValue = DayOfMonthRegex.map(
  (value) => new DayOfMonthValueAtom(Number(value))
);

const DayOfMonthWeekdayValue = Parsimmon.seq(
  DayOfMonthValue,
  Parsimmon.string("W")
).map(([atom, _]) => new DayOfMonthWeekdayAtom(atom));

const DayOfMonthOffsetRegex = Parsimmon.regexp(/\d?\d/);

const LastDayOfMonth = Parsimmon.string("L").map(
  () => new LastDayOfMonthAtom()
);

const LastDayOfMonthWithOffset = Parsimmon.seq(
  Parsimmon.string("L-"),
  DayOfMonthOffsetRegex
).map(([_, offset]) => new LastDayOfMonthAtom(Number(offset)));

const LastWeekdayOfMonth = Parsimmon.string("LW").map(
  () => new DayOfMonthWeekdayAtom(new DayOfMonthValueAtom(31))
);

const DayOfMonthRange = Parsimmon.seq(
  DayOfMonthValue,
  Parsimmon.string("-"),
  DayOfMonthValue
).map(([min, _, max]) => new DayOfMonthRangeAtom(min, max));

const DayOfMonthSteppedRange = Parsimmon.seq(
  DayOfMonthRange,
  Parsimmon.string("/"),
  DayOfMonthRegex
).map(
  ([range, _, step]) =>
    new DayOfMonthRangeAtom(range.min, range.max, Number(step))
);

const DayOfMonthRangeOrValue = Parsimmon.alt(
  DayOfMonthSteppedRange,
  DayOfMonthRange,
  DayOfMonthWeekdayValue,
  LastDayOfMonthWithOffset,
  LastWeekdayOfMonth,
  LastDayOfMonth,
  DayOfMonthValue
);

const DayOfMonthList = DayOfMonthRangeOrValue.sepBy(
  Parsimmon.string(",")
).map((atoms) => (atoms.length === 1 ? atoms : new OrAtom(atoms)));

const Blank = Parsimmon.string("?").map(() => new NoopAtom());

export const DayOfMonth = Parsimmon.alt(
  DayOfMonthSteppedWildcard,
  DayOfMonthWildcard,
  Blank,
  DayOfMonthList,
  DayOfMonthRangeOrValue
);
