import Parsimmon from "parsimmon";
import { OrAtom } from "../schedule-atoms/combinators";
import { HourValueAtom, HourRangeAtom } from "../schedule-atoms/hours";

const HoursRegex = Parsimmon.regexp(/(2[0-3]|[0-1]?[0-9])/);

const HoursWildcard = Parsimmon.string("*").map(() => new HourRangeAtom(0, 23));

const HoursSteppedWildcard = Parsimmon.seq(
  HoursWildcard,
  Parsimmon.string("/"),
  HoursRegex
).map(
  ([range, _, step]) => new HourRangeAtom(range.min, range.max, Number(step))
);

const HoursValue = HoursRegex.map((value) => new HourValueAtom(Number(value)));

const HoursRange = Parsimmon.seq(
  HoursValue,
  Parsimmon.string("-"),
  HoursValue
).map(([min, _, max]) => new HourRangeAtom(min, max));

const HoursSteppedRange = Parsimmon.seq(
  HoursRange,
  Parsimmon.string("/"),
  HoursRegex
).map(
  ([range, _, step]) => new HourRangeAtom(range.min, range.max, Number(step))
);

const HoursRangeOrValue = Parsimmon.alt(
  HoursSteppedRange,
  HoursRange,
  HoursValue
);

const HoursList = HoursRangeOrValue.sepBy(Parsimmon.string(",")).map((atoms) =>
  atoms.length === 1 ? atoms : new OrAtom(atoms)
);

export const Hours = Parsimmon.alt(
  HoursSteppedWildcard,
  HoursWildcard,
  HoursList,
  HoursRangeOrValue
);
