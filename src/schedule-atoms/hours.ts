import { getHours, setHours } from "date-fns";
import { ValueAtom, RangeAtom } from "./base";

export class HourValueAtom extends ValueAtom {
  static MIN_VALUE = 0;
  static MAX_VALUE = 23;
  getDateValue(date: Date) {
    return getHours(date);
  }
  calculateNextDate(date: Date, value: number) {
    return setHours(date, value);
  }
}

export class HourRangeAtom extends RangeAtom {
  static MIN_VALUE = 0;
  static MAX_VALUE = 23;
  getDateValue(date: Date) {
    return getHours(date);
  }
  calculateNextDate(date: Date, value: number) {
    return setHours(date, value);
  }
}
