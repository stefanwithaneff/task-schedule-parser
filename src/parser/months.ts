import Parsimmon from "parsimmon";
import { OrAtom } from "../schedule-atoms/combinators";
import { MonthValueAtom, MonthRangeAtom } from "../schedule-atoms/month";

const MonthsRegex = Parsimmon.regexp(/\d?\d/);

const MonthsWildcard = Parsimmon.string("*").map(
  () => new MonthRangeAtom(1, 12)
);

const MonthsSteppedWildcard = Parsimmon.seq(
  MonthsWildcard,
  Parsimmon.string("/"),
  MonthsRegex
).map(
  ([range, _, step]) => new MonthRangeAtom(range.min, range.max, Number(step))
);

const MonthsValue = MonthsRegex.map(
  (value) => new MonthValueAtom(Number(value))
);

const MonthsRange = Parsimmon.seq(
  MonthsValue,
  Parsimmon.string("-"),
  MonthsValue
).map(([min, _, max]) => new MonthRangeAtom(min, max));

const MonthsSteppedRange = Parsimmon.seq(
  MonthsRange,
  Parsimmon.string("/"),
  MonthsRegex
).map(
  ([range, _, step]) => new MonthRangeAtom(range.min, range.max, Number(step))
);

const MonthsRangeOrValue = Parsimmon.alt(
  MonthsSteppedRange,
  MonthsRange,
  MonthsValue
);

const MonthsList = MonthsRangeOrValue.sepBy(
  Parsimmon.string(",")
).map((atoms) => (atoms.length === 1 ? atoms : new OrAtom(atoms)));

export const Months = Parsimmon.alt(
  MonthsSteppedWildcard,
  MonthsWildcard,
  MonthsList,
  MonthsRangeOrValue
);
