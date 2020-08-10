import Parsimmon from "parsimmon";
import { Scheduler } from "../scheduler";
import { Months } from "./months";
import { DayOfWeek } from "./day-of-week";
import { DayOfMonth } from "./day-of-month";
import { Hours } from "./hours";
import { Minutes } from "./minutes";
import { OrAtom } from "../schedule-atoms/combinators";

const Space = Parsimmon.string(" ");

export const Cron = Parsimmon.seq(
  Minutes,
  Space,
  Hours,
  Space,
  DayOfMonth,
  Space,
  Months,
  Space,
  DayOfWeek
).map(([minutes, _, hours, _1, dayOfMonth, _2, months, _3, dayOfWeek]) => ({
  minutes,
  hours,
  days: new OrAtom([dayOfMonth, dayOfWeek]),
  months,
}));
