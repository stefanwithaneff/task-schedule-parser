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
    return date.set({ hour: value }).startOf("hour");
  }
}
