import { DateTime } from "luxon";
import { ValueAtom, RangeAtom } from "./base";

export class MonthValueAtom extends ValueAtom {
  static MIN_VALUE = 1;
  static MAX_VALUE = 12;
  getDateValue(date: DateTime) {
    return date.month;
  }
  calculateNextDate(date: DateTime, value: number) {
    return date.set({ month: value });
  }
}

export class MonthRangeAtom extends RangeAtom {
  static MIN_VALUE = 1;
  static MAX_VALUE = 12;
  getDateValue(date: DateTime) {
    return date.month;
  }
  calculateNextDate(date: DateTime, value: number) {
    return date.set({ month: value });
  }
}
