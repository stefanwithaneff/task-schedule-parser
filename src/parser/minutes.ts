import Parsimmon from "parsimmon";
import { OrAtom } from "../schedule-atoms/combinators";
import { MinuteValueAtom, MinuteRangeAtom } from "../schedule-atoms/minutes";

const MinutesRegex = Parsimmon.regexp(/\d?\d/);

const MinutesWildcard = Parsimmon.string("*").map(
  () => new MinuteRangeAtom(0, 59)
);

const MinutesSteppedWildcard = Parsimmon.seq(
  MinutesWildcard,
  Parsimmon.string("/"),
  MinutesRegex
).map(
  ([range, _, step]) => new MinuteRangeAtom(range.min, range.max, Number(step))
);

const MinutesValue = MinutesRegex.map(
  (value) => new MinuteValueAtom(Number(value))
);

const MinutesRange = Parsimmon.seq(
  MinutesValue,
  Parsimmon.string("-"),
  MinutesValue
).map(([min, _, max]) => new MinuteRangeAtom(min, max));

const MinutesSteppedRange = Parsimmon.seq(
  MinutesRange,
  Parsimmon.string("/"),
  MinutesRegex
).map(
  ([range, _, step]) => new MinuteRangeAtom(range.min, range.max, Number(step))
);

const MinutesRangeOrValue = Parsimmon.alt(
  MinutesSteppedRange,
  MinutesRange,
  MinutesValue
);

const MinutesList = MinutesRangeOrValue.sepBy(
  Parsimmon.string(",")
).map((atoms) => (atoms.length === 1 ? atoms[0] : new OrAtom(atoms)));

export const Minutes = Parsimmon.alt(
  MinutesSteppedWildcard,
  MinutesWildcard,
  MinutesList,
  MinutesRangeOrValue
);
