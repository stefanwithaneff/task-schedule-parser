import { DateTime } from "luxon";
import { ScheduleAtom } from "./schedule-atoms/base";
import { Cron } from "./parser/cron";
import { NextDateNotFoundError } from "./errors";

type SchedulerConfig = {
  cronExpression: string;
};

type ScheduleAtomMap = {
  minutes: ScheduleAtom;
  hours: ScheduleAtom;
  days: ScheduleAtom;
  months: ScheduleAtom;
};

const MAX_ITERATIONS = 100;

type Unit = "minutes" | "hours" | "days" | "months" | "years";

export class Scheduler {
  private readonly atoms: ScheduleAtomMap;
  constructor(config: SchedulerConfig) {
    this.atoms = Cron.tryParse(config.cronExpression);
  }

  private getNextValid(unit: Unit, date: DateTime): DateTime {
    const units: Unit[] = ["minutes", "hours", "days", "months", "years"];

    if (unit === "years") {
      return date.plus({ years: 1 }).startOf("year");
    }

    const nextDate = this.atoms[unit].getNextDateAfter(date);

    if (nextDate === null) {
      const index = units.indexOf(unit);
      return this.getNextValid(units[index + 1], date);
    }

    return nextDate;
  }

  getNextDateAfter(date: Date, timezone?: string): Date {
    const dateTime = DateTime.fromJSDate(date, { zone: timezone });

    const { minutes, hours, days, months } = this.atoms;

    let i = 0;
    let nextDateTime = dateTime;
    while (i < MAX_ITERATIONS) {
      if (!months.isValid(nextDateTime)) {
        nextDateTime = this.getNextValid("months", nextDateTime);
      }
      if (!days.isValid(nextDateTime)) {
        nextDateTime = this.getNextValid("days", nextDateTime);
      }
      if (!hours.isValid(nextDateTime)) {
        nextDateTime = this.getNextValid("hours", nextDateTime);
      }
      if (!minutes.isValid(nextDateTime) || nextDateTime.equals(dateTime)) {
        nextDateTime = this.getNextValid("minutes", nextDateTime);
      }
      if (
        months.isValid(nextDateTime) &&
        days.isValid(nextDateTime) &&
        hours.isValid(nextDateTime) &&
        minutes.isValid(nextDateTime)
      ) {
        return nextDateTime.toJSDate();
      }

      i++;
    }

    throw new NextDateNotFoundError("Could not find a next valid date");
  }
}
