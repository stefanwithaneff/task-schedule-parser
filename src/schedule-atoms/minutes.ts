import { DateTime } from "luxon";
import { ValueAtom, RangeAtom } from "./base";

export class MinuteValueAtom extends ValueAtom {
  static MIN_VALUE = 0;
  static MAX_VALUE = 59;
  getDateValue(date: DateTime) {
    return date.minute;
  }
  calculateNextDate(date: DateTime, value: number) {
    return date.set({ minute: value });
  }
}

export class MinuteRangeAtom extends RangeAtom {
  static MIN_VALUE = 0;
  static MAX_VALUE = 59;
  getDateValue(date: DateTime) {
    return date.minute;
  }
  calculateNextDate(date: DateTime, value: number) {
    return date.set({ minute: value });
  }
}
