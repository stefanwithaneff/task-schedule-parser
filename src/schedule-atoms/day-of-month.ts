import { DateTime } from "luxon";
import { ScheduleAtom, ValueAtom, RangeAtom } from "./base";

const MIN_DAY_OF_MONTH = 1;
const MAX_DAY_OF_MONTH = 31;

export class DayOfMonthValueAtom extends ValueAtom {
  static MIN_VALUE = MIN_DAY_OF_MONTH;
  static MAX_VALUE = MAX_DAY_OF_MONTH;
  getDateValue(date: DateTime) {
    return date.day;
  }

  getMaxDateValue(date: DateTime) {
    return date.daysInMonth;
  }

  calculateNextDate(date: DateTime, value: number) {
    return date.set({ day: value }).startOf("day");
  }
}

export class DayOfMonthRangeAtom extends RangeAtom {
  static MIN_VALUE = MIN_DAY_OF_MONTH;
  static MAX_VALUE = MAX_DAY_OF_MONTH;
  getDateValue(date: DateTime) {
    return date.day;
  }

  getMaxDateValue(date: DateTime) {
    return date.daysInMonth;
  }

  calculateNextDate(date: DateTime, value: number) {
    return date.set({ day: value }).startOf("day");
  }
}

// Find the closest weekday to the given value that also falls in the same date
// as the given month
// If the number is higher than the number of days of the month, find the last weekday of the month
function getWeekdayValueForMonth(date: DateTime, value: number) {
  const daysInMonth = date.daysInMonth;
  const dayClosestToValue = daysInMonth < value ? daysInMonth : value;
  const dayOfMonthDate = date.set({ day: dayClosestToValue });
  const dayOfWeek = dayOfMonthDate.weekday;

  if (dayOfWeek === 7) {
    const nextMonday = dayOfMonthDate.plus({ day: 1 });

    if (date.month === nextMonday.month) {
      return dayClosestToValue + 1;
    } else {
      return dayClosestToValue - 2;
    }
  }

  if (dayOfWeek === 6) {
    const prevFriday = dayOfMonthDate.minus({ day: 1 });

    if (date.month === prevFriday.month) {
      return dayClosestToValue - 1;
    } else {
      return dayClosestToValue + 2;
    }
  }

  return dayClosestToValue;
}

export class DayOfMonthWeekdayAtom implements ScheduleAtom {
  readonly value: number;
  constructor(atom: DayOfMonthValueAtom) {
    const value = atom.value;

    if (value < MIN_DAY_OF_MONTH || value > MAX_DAY_OF_MONTH) {
      throw new RangeError(
        `Invalid value for Day of Month: ${value}W. Must be between ${MIN_DAY_OF_MONTH} and ${MAX_DAY_OF_MONTH}`
      );
    }

    this.value = atom.value;
  }

  getNextDateAfter(date: DateTime) {
    const value = getWeekdayValueForMonth(date, this.value);
    const dayOfMonth = date.day;

    if (dayOfMonth < value) {
      return date.set({ day: value }).startOf("day");
    }
    return null;
  }

  isValid(date: DateTime) {
    const value = getWeekdayValueForMonth(date, this.value);

    return date.day === value;
  }

  toString() {
    return `Weekday(${this.value})`;
  }
}

export class LastDayOfMonthAtom implements ScheduleAtom {
  readonly offset: number;
  constructor(offset: number = 0) {
    if (offset < 0 || offset > MAX_DAY_OF_MONTH - 1) {
      throw new RangeError(
        `Invalid value for Day of Month: L-${offset}. Must be between ${MIN_DAY_OF_MONTH} and ${
          MAX_DAY_OF_MONTH - 1
        }`
      );
    }
    this.offset = offset;
  }

  getNextDateAfter(date: DateTime) {
    const daysInMonthWithOffset = date.daysInMonth - this.offset;

    if (date.day < daysInMonthWithOffset) {
      return date.set({ day: daysInMonthWithOffset }).startOf("day");
    }

    return null;
  }

  isValid(date: DateTime) {
    return date.day === date.daysInMonth - this.offset;
  }

  toString() {
    return `LastOfMonth(${this.offset})`;
  }
}
