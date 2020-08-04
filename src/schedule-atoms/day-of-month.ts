import {
  getDaysInMonth,
  getDate,
  getDay,
  isSameMonth,
  addDays,
  subDays,
  setDate,
} from "date-fns";
import { ScheduleAtom, ValueAtom, RangeAtom } from "./base";

export class DayOfMonthValueAtom extends ValueAtom {
  static MIN_VALUE = 1;
  static MAX_VALUE = 31;
  getDateValue(date: Date) {
    return getDate(date);
  }
  calculateNextDate(date: Date, value: number) {
    return setDate(date, value);
  }
}

export class DayOfMonthRangeAtom extends RangeAtom {
  static MIN_VALUE = 1;
  static MAX_VALUE = 31;
  getDateValue(date: Date) {
    return getDate(date);
  }

  getMaxDateValue(date: Date) {
    return getDaysInMonth(date);
  }

  calculateNextDate(date: Date, value: number) {
    return setDate(date, value);
  }
}

// Find the closest weekday to the given value that also falls in the same date
// as the given month
// If the number is higher than the number of days of the month, find the last weekday of the month
function getWeekdayValueForMonth(date: Date, value: number) {
  const daysInMonth = getDaysInMonth(date);
  const dayClosestToValue = daysInMonth < value ? daysInMonth : value;
  const dayOfMonthDate = setDate(date, dayClosestToValue);
  const dayOfWeek = getDay(dayOfMonthDate);

  if (dayOfWeek === 0) {
    const nextMonday = addDays(dayOfMonthDate, 1);

    if (isSameMonth(date, nextMonday)) {
      return dayClosestToValue + 1;
    } else {
      return dayClosestToValue - 2;
    }
  }

  if (dayOfWeek === 6) {
    const prevFriday = subDays(dayOfMonthDate, 1);

    if (isSameMonth(date, prevFriday)) {
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
    this.value = atom.value;
  }

  getNextDateAfter(date: Date) {
    const value = getWeekdayValueForMonth(date, this.value);
    const dayOfMonth = getDate(date);

    if (dayOfMonth < value) {
      return setDate(date, value);
    }
    return null;
  }

  isValid(date: Date) {
    const value = getWeekdayValueForMonth(date, this.value);

    return getDate(date) === value;
  }

  toString() {
    return `Weekday(${this.value})`;
  }
}
