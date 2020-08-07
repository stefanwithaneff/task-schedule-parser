import { DateTime } from "luxon";
import {
  DayOfMonthWeekdayAtom,
  DayOfMonthValueAtom,
  DayOfMonthRangeAtom,
  LastDayOfMonthAtom,
} from "../day-of-month";

describe("Day of Month Scheduling Atoms", () => {
  describe("Value atom", () => {
    it("returns null if the provided value is greater than the total number of days for the given month", () => {
      const atom = new DayOfMonthValueAtom(31);
      const date = DateTime.local(2020, 9, 1);

      expect(atom.getNextDateAfter(date)).toBe(null);
    });
  });

  describe("Range atom", () => {
    it("returns null if the next date in the range does not exist", () => {
      const atom = new DayOfMonthRangeAtom(28, 31);
      const date = DateTime.local(2020, 9, 30);

      expect(atom.getNextDateAfter(date)).toBe(null);
    });
  });

  describe("Weekday Atom", () => {
    const beginningOfMonthSaturday = DateTime.local(2020, 8, 1);
    const endOfMonthSunday = DateTime.local(2021, 1, 31);
    it("returns the next date to fall on the provided day of month if that day is a weekday", () => {
      // 2020-08-12 is a Wednesday
      const atom = new DayOfMonthWeekdayAtom(new DayOfMonthValueAtom(12));
      const date = DateTime.local(2020, 8, 2);

      expect(atom.getNextDateAfter(date)).toEqual(date.set({ day: 12 }));
    });

    it("returns null if the provided date comes after the closest weekday to the value", () => {
      // 2020-08-12 is a Wednesday
      const atom = new DayOfMonthWeekdayAtom(new DayOfMonthValueAtom(12));
      const date = DateTime.local(2020, 8, 14);

      expect(atom.getNextDateAfter(date)).toBe(null);
    });

    it("returns the Friday before if the day of month is a Saturday", () => {
      // 2020-08-15 is a Saturday
      // 2020-08-14 is the Friday before
      const atom = new DayOfMonthWeekdayAtom(new DayOfMonthValueAtom(15));
      const date = DateTime.local(2020, 8, 2);

      expect(atom.getNextDateAfter(date)).toEqual(date.set({ day: 14 }));
    });

    it("returns the Monday after if the day of month is a Saturday and the 1st of the month", () => {
      // 2020-08-01 is a Saturday
      // 2020-08-03 is the Monday after
      const atom = new DayOfMonthWeekdayAtom(new DayOfMonthValueAtom(1));
      const date = DateTime.local(2020, 8, 1);

      expect(atom.getNextDateAfter(date)).toEqual(date.set({ day: 3 }));
    });

    it("returns the Monday after if the day of month is a Sunday", () => {
      // 2020-08-16 is a Sunday
      // 2020-08-17 is the Monday after
      const atom = new DayOfMonthWeekdayAtom(new DayOfMonthValueAtom(16));
      const date = DateTime.local(2020, 8, 2);

      expect(atom.getNextDateAfter(date)).toEqual(date.set({ day: 17 }));
    });

    it("returns the Friday before if the day of month is a Sunday and the last day of the month", () => {
      // 2021-01-31 is a Sunday
      // 2021-01-29 is the Friday before
      const atom = new DayOfMonthWeekdayAtom(new DayOfMonthValueAtom(31));
      const date = DateTime.local(2021, 1, 2);

      expect(atom.getNextDateAfter(date)).toEqual(date.set({ day: 29 }));
    });

    it("returns the nearest weekday to the end of the month if the value is higher than the number of days in the month", () => {
      // 2021-02-28 is a Sunday
      // 2021-02-26 is the Friday before
      const atom = new DayOfMonthWeekdayAtom(new DayOfMonthValueAtom(31));
      const date = DateTime.local(2021, 2, 1);

      expect(atom.getNextDateAfter(date)).toEqual(date.set({ day: 26 }));
    });
  });

  describe("Last Day of Month Atom", () => {
    it("returns the date for the last day of the month if the provided date is on an earlier day", () => {
      const date = DateTime.local(2020, 8, 1);
      const atom = new LastDayOfMonthAtom();

      expect(atom.getNextDateAfter(date)).toEqual(date.set({ day: 31 }));
    });

    it("returns the date for the nth-to-last day of the month if an offset is provided", () => {
      const date = DateTime.local(2020, 9, 1);
      const atom = new LastDayOfMonthAtom(4);

      expect(atom.getNextDateAfter(date)).toEqual(date.set({ day: 26 }));
    });

    it("returns null if the provided date falls after the nth-to-last day of the month", () => {
      const date = DateTime.local(2020, 9, 28);
      const atom = new LastDayOfMonthAtom(4);

      expect(atom.getNextDateAfter(date)).toBe(null);
    });
  });
});
