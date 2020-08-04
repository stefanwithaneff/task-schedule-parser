import { getMinutes, setMinutes } from "date-fns";
import { ValueAtom, RangeAtom } from "./base";

export class MinuteValueAtom extends ValueAtom {
  static MIN_VALUE = 0;
  static MAX_VALUE = 59;
  getDateValue(date: Date) {
    return getMinutes(date);
  }
  calculateNextDate(date: Date, value: number) {
    return setMinutes(date, value);
  }
}

export class MinuteRangeAtom extends RangeAtom {
  static MIN_VALUE = 0;
  static MAX_VALUE = 59;
  getDateValue(date: Date) {
    return getMinutes(date);
  }
  calculateNextDate(date: Date, value: number) {
    return setMinutes(date, value);
  }
}
