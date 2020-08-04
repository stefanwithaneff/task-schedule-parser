import { DateTime } from "luxon";
import { ScheduleAtom } from "./base";

export class OrAtom implements ScheduleAtom {
  constructor(private atoms: ScheduleAtom[]) {}

  getNextDateAfter(date: DateTime) {
    const dateValues = this.atoms
      .map((atom) => atom.getNextDateAfter(date))
      .filter((result) => result !== null);

    if (dateValues.length > 0) {
      return DateTime.min(...dateValues);
    }

    return null;
  }

  isValid(date: DateTime) {
    return this.atoms.some((atom) => atom.isValid(date));
  }

  toString() {
    return `OR(${this.atoms.map((atom) => atom.toString()).join(",")})`;
  }
}
