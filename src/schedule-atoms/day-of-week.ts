import { DateTime } from "luxon";
import { ScheduleAtom } from "./base";
import { InvalidRangeError } from "./errors";

const MIN_CRON_DAY_OF_WEEK_VALUE = 0;
const MAX_CRON_DAY_OF_WEEK_VALUE = 6;

// Cron values are from 0-6/SUN-SAT, Luxon ranges from 1-7/MON-SUN
function convertLuxonValueToCronValue(luxonValue: number): number {
  return luxonValue === 7 ? 0 : luxonValue;
}

export class DayOfWeekValueAtom implements ScheduleAtom {
  readonly value: number;
  constructor(value: number) {
    if (
      value < MIN_CRON_DAY_OF_WEEK_VALUE ||
      value > MAX_CRON_DAY_OF_WEEK_VALUE
    ) {
      throw new RangeError(
        `Invalid value for Day of Week: ${value}. Must be between ${MIN_CRON_DAY_OF_WEEK_VALUE} and ${MAX_CRON_DAY_OF_WEEK_VALUE}`
      );
    }
    this.value = value;
  }

  getNextDateAfter(date: DateTime) {
    const currentWeekday = convertLuxonValueToCronValue(date.weekday);

    let nextDate;
    if (currentWeekday < this.value) {
      nextDate = date.plus({ days: this.value - currentWeekday });
    } else if (currentWeekday === this.value) {
      nextDate = date.plus({ days: 7 });
    } else {
      nextDate = date.plus({ days: 7 - currentWeekday + this.value });
    }

    if (nextDate.month === date.month) {
      return nextDate.startOf("day");
    }

    return null;
  }

  isValid(date: DateTime) {
    return convertLuxonValueToCronValue(date.weekday) === this.value;
  }

  toString() {
    return `Value(${this.value})`;
  }
}

export class DayOfWeekRangeAtom implements ScheduleAtom {
  readonly min: number;
  readonly max: number;

  constructor(
    minAtom: DayOfWeekValueAtom | number,
    maxAtom: DayOfWeekValueAtom | number
  ) {
    const min = minAtom instanceof DayOfWeekValueAtom ? minAtom.value : minAtom;
    const max = maxAtom instanceof DayOfWeekValueAtom ? maxAtom.value : maxAtom;
    if (min < MIN_CRON_DAY_OF_WEEK_VALUE) {
      throw new RangeError(
        `Invalid minimum value for Day of Week Range: ${min}. Must be between ${MIN_CRON_DAY_OF_WEEK_VALUE} and ${MAX_CRON_DAY_OF_WEEK_VALUE}`
      );
    }

    if (max > MAX_CRON_DAY_OF_WEEK_VALUE) {
      throw new RangeError(
        `Invalid maximum value for Day of Week Range: ${max}. Must be between ${MIN_CRON_DAY_OF_WEEK_VALUE} and ${MAX_CRON_DAY_OF_WEEK_VALUE}`
      );
    }

    if (min > max) {
      throw new InvalidRangeError(
        `Min range value cannot be higher than the max value for Day of Week. Min: ${min}, Max: ${max}`
      );
    }

    this.min = min;
    this.max = max;
  }

  getNextDateAfter(date: DateTime) {
    const currentWeekday = convertLuxonValueToCronValue(date.weekday);

    let nextDate: DateTime;
    if (currentWeekday < this.min) {
      nextDate = date.plus({ days: this.min - currentWeekday });
    } else if (currentWeekday < this.max) {
      nextDate = date.plus({ days: 1 });
    } else {
      nextDate = date.plus({ days: 7 - currentWeekday + this.min });
    }

    if (nextDate.month === date.month) {
      return nextDate.startOf("day");
    }
    return null;
  }

  isValid(date: DateTime) {
    const currentWeekday = convertLuxonValueToCronValue(date.weekday);

    return currentWeekday >= this.min && currentWeekday <= this.max;
  }
}

export class LastDayOfWeekAtom implements ScheduleAtom {
  readonly value: number;

  constructor(atom: DayOfWeekValueAtom) {
    const value = atom.value;
    if (
      value < MIN_CRON_DAY_OF_WEEK_VALUE ||
      value > MAX_CRON_DAY_OF_WEEK_VALUE
    ) {
      throw new RangeError(
        `Invalid value for Day of Week: ${value}L. Must be between ${MIN_CRON_DAY_OF_WEEK_VALUE} and ${MAX_CRON_DAY_OF_WEEK_VALUE}`
      );
    }
    this.value = value;
  }

  getNextDateAfter(date: DateTime) {
    const lastDay = date.set({ day: date.daysInMonth });
    const lastWeekdayOfMonth = convertLuxonValueToCronValue(lastDay.weekday);

    let nextDate: DateTime;
    if (lastWeekdayOfMonth === this.value) {
      nextDate = lastDay;
    } else if (lastWeekdayOfMonth > this.value) {
      nextDate = lastDay.minus({ day: lastWeekdayOfMonth - this.value });
    } else {
      nextDate = lastDay.minus({ day: 7 - this.value + lastWeekdayOfMonth });
    }

    if (date.day < nextDate.day) {
      return nextDate.startOf("day");
    }

    return null;
  }

  isValid(date: DateTime) {
    return (
      convertLuxonValueToCronValue(date.weekday) === this.value &&
      date.daysInMonth - date.day < 7
    );
  }

  toString() {
    return `LastDayOfWeek(${this.value})`;
  }
}

export class NthDayOfWeekAtom implements ScheduleAtom {
  readonly dayOfWeek: number;
  readonly ordinal: number;

  constructor(dayOfWeek: DayOfWeekValueAtom, ordinal: number) {
    if (
      dayOfWeek.value < MIN_CRON_DAY_OF_WEEK_VALUE ||
      dayOfWeek.value > MAX_CRON_DAY_OF_WEEK_VALUE
    ) {
      throw new RangeError(
        `Invalid value for Day of Week: ${dayOfWeek.value}#${ordinal}. Must be between ${MIN_CRON_DAY_OF_WEEK_VALUE} and ${MAX_CRON_DAY_OF_WEEK_VALUE}`
      );
    }

    if (ordinal < 1 || ordinal > 5) {
      throw new RangeError(
        `Invalid ordinal for Day of Week: ${dayOfWeek.value}#${ordinal}. Must be between 1 and 5`
      );
    }

    this.dayOfWeek = dayOfWeek.value;
    this.ordinal = ordinal;
  }

  getNextDateAfter(date: DateTime) {
    const startOfMonth = date.startOf("month");
    const startingWeekday = convertLuxonValueToCronValue(startOfMonth.weekday);

    let weekdayOffset: number;
    if (startingWeekday <= this.dayOfWeek) {
      weekdayOffset = this.dayOfWeek - startingWeekday;
    } else {
      weekdayOffset = 7 - startingWeekday + this.dayOfWeek;
    }

    const weekOffset = this.ordinal - 1;
    const totalOffset = weekdayOffset + weekOffset * 7;
    const nextDate = startOfMonth.plus({ days: totalOffset });

    if (date.month === nextDate.month && date.day < nextDate.day) {
      return nextDate.startOf("day");
    }

    return null;
  }

  isValid(date: DateTime) {
    return (
      convertLuxonValueToCronValue(date.weekday) === this.dayOfWeek &&
      Math.ceil(date.day / 7) === this.ordinal
    );
  }
}
