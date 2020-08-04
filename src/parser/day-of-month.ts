import Parsimmon from "parsimmon";
import { OrAtom } from "../schedule-atoms/combinators";
import {
  DayOfMonthValueAtom,
  DayOfMonthRangeAtom,
  DayOfMonthWeekdayAtom,
} from "../schedule-atoms/day-of-month";

const DayOfMonthRegex = Parsimmon.regexp(/(3[0-1]|[0-2]?[0-9])/);

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
  DayOfMonthValue
);

const DayOfMonthList = DayOfMonthRangeOrValue.sepBy(
  Parsimmon.string(",")
).map((atoms) => (atoms.length === 1 ? atoms : new OrAtom(atoms)));

export const DayOfMonth = Parsimmon.alt(
  DayOfMonthSteppedWildcard,
  DayOfMonthWildcard,
  DayOfMonthList,
  DayOfMonthRangeOrValue
);
