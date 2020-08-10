import { DateTime } from "luxon";
import { ValueAtom, RangeAtom } from "./base";

export class HourValueAtom extends ValueAtom {
  static MIN_VALUE = 0;
  static MAX_VALUE = 23;
  getDateValue(date: DateTime) {
    return date.hour;
  }
  calculateNextDate(date: DateTime, value: number) {
    return date.set({ hour: value }).startOf("hour");
  }
}

export class HourRangeAtom extends RangeAtom {
  static MIN_VALUE = 0;
  static MAX_VALUE = 23;
  getDateValue(date: DateTime) {
    return date.hour;
  }
  calculateNextDate(date: DateTime, value: number) {
    const dateValue = this.getDateValue(date);
    let nextDate = date.set({ hour: value });
    const timeShiftedBackwards = nextDate.offset < date.offset;
    const maybeDuplicateHourInRange =
      this.step === 1 && this.min <= dateValue && value === dateValue + 1;

    // Handle duplicate hour from backwards DST time shift
    // Required to allow for continuous hourly/minutely jobs
    if (maybeDuplicateHourInRange && timeShiftedBackwards) {
      nextDate = nextDate.minus({ hour: 1 });
    }

    return nextDate.startOf("hour");
  }
}
