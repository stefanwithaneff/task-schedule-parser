import { DateTime } from "luxon";
import {
  DayOfWeekValueAtom,
  DayOfWeekRangeAtom,
  LastDayOfWeekAtom,
  NthDayOfWeekAtom,
} from "../day-of-week";
import { DayOfMonthRangeAtom } from "../day-of-month";
import { InvalidRangeError } from "../../errors";

describe("Day of Week Scheduling Atoms", () => {
  describe("Day of Week Value atom", () => {
    it("throws a RangeError when the provided value is less than the minimum possible value", () => {
      expect(() => new DayOfWeekValueAtom(-1)).toThrow(RangeError);
    });

    it("throws a RangeError when the provided value is greater than the maximum possible value", () => {
      expect(() => new DayOfWeekValueAtom(7)).toThrow(RangeError);
    });

    it("returns the next day of the month that matches the given weekday", () => {
      const atom = new DayOfWeekValueAtom(3);
      const date1 = DateTime.local(2020, 8, 3);
      const date2 = DateTime.local(2020, 8, 5);
      const date3 = DateTime.local(2020, 8, 7);

      expect(atom.getNextDateAfter(date1)).toEqual(date1.set({ day: 5 }));
      expect(atom.getNextDateAfter(date2)).toEqual(date2.set({ day: 12 }));
      expect(atom.getNextDateAfter(date3)).toEqual(date3.set({ day: 12 }));
    });

    it("correctly returns the next Sunday of the month if 0 is provided", () => {
      const atom = new DayOfWeekValueAtom(0);
      const date1 = DateTime.local(2020, 8, 3);
      const date2 = DateTime.local(2020, 8, 9);

      expect(atom.getNextDateAfter(date1)).toEqual(date1.set({ day: 9 }));
      expect(atom.getNextDateAfter(date2)).toEqual(date2.set({ day: 16 }));
    });

    it("returns null if the next matching day occurs in the next month", () => {
      const atom = new DayOfWeekValueAtom(3);
      const date = DateTime.local(2020, 8, 27);

      expect(atom.getNextDateAfter(date)).toBe(null);
    });

    it("returns true if the provided date matches the given weekday", () => {
      const atom1 = new DayOfWeekValueAtom(0);
      const date1 = DateTime.local(2020, 8, 9);
      const atom2 = new DayOfWeekValueAtom(3);
      const date2 = DateTime.local(2020, 8, 5);

      expect(atom1.isValid(date1)).toBe(true);
      expect(atom2.isValid(date2)).toBe(true);
    });

    it("returns false if the provided date matches the given weekday", () => {
      const atom1 = new DayOfWeekValueAtom(0);
      const date1 = DateTime.local(2020, 8, 5);
      const atom2 = new DayOfWeekValueAtom(3);
      const date2 = DateTime.local(2020, 8, 9);

      expect(atom1.isValid(date1)).toBe(false);
      expect(atom2.isValid(date2)).toBe(false);
    });
  });

  describe("Day of Week Range atom", () => {
    it("throws a RangeError when the provided value is less than the minimum possible value", () => {
      expect(() => new DayOfWeekRangeAtom(-1, 4)).toThrow(RangeError);
    });

    it("throws a RangeError when the provided value is greater than the maximum possible value", () => {
      expect(() => new DayOfWeekRangeAtom(2, 7)).toThrow(RangeError);
    });

    it("throws an InvalidRangeError when the provided min is greater than the provided max", () => {
      expect(() => new DayOfMonthRangeAtom(4, 2)).toThrow(InvalidRangeError);
    });

    it("returns the next date matching the range of weekdays", () => {
      const atom = new DayOfWeekRangeAtom(1, 4);
      const date1 = DateTime.local(2020, 8, 6);
      const date2 = DateTime.local(2020, 8, 9);
      const date3 = DateTime.local(2020, 8, 11);

      expect(atom.getNextDateAfter(date1)).toEqual(date1.set({ day: 10 }));
      expect(atom.getNextDateAfter(date2)).toEqual(date2.set({ day: 10 }));
      expect(atom.getNextDateAfter(date3)).toEqual(date3.set({ day: 12 }));
    });

    it("returns null if the next matching date in the range occurs in the next month", () => {
      const atom = new DayOfWeekRangeAtom(1, 4);
      const date = DateTime.local(2020, 8, 31);

      expect(atom.getNextDateAfter(date)).toBe(null);
    });

    it("returns true if the date matches the provided range of weekdays", () => {
      const atom1 = new DayOfWeekRangeAtom(3, 6);
      const date1 = DateTime.local(2020, 8, 6);
      const atom2 = new DayOfWeekRangeAtom(0, 2);
      const date2 = DateTime.local(2020, 8, 9);

      expect(atom1.isValid(date1)).toBe(true);
      expect(atom2.isValid(date2)).toBe(true);
    });

    it("returns false if the date does not match the provided range of weekdays", () => {
      const atom1 = new DayOfWeekRangeAtom(3, 6);
      const date1 = DateTime.local(2020, 8, 9);
      const atom2 = new DayOfWeekRangeAtom(0, 2);
      const date2 = DateTime.local(2020, 8, 6);

      expect(atom1.isValid(date1)).toBe(false);
      expect(atom2.isValid(date2)).toBe(false);
    });
  });

  describe("Last Day of Week atom", () => {
    it("throws a RangeError when the provided value is less than the minimum possible value", () => {
      expect(() => new LastDayOfWeekAtom(new DayOfWeekValueAtom(-1))).toThrow(
        RangeError
      );
    });

    it("throws a RangeError when the provided value is greater than the maximum possible value", () => {
      expect(() => new LastDayOfWeekAtom(new DayOfWeekValueAtom(7))).toThrow(
        RangeError
      );
    });

    it("returns the last day of the month if it matches the provided weekday", () => {
      const atom = new LastDayOfWeekAtom(new DayOfWeekValueAtom(1));
      const date = DateTime.local(2020, 8, 15);

      expect(atom.getNextDateAfter(date)).toEqual(date.set({ day: 31 }));
    });

    it("returns the last nth day of the month that matches the provided value", () => {
      const atom1 = new LastDayOfWeekAtom(new DayOfWeekValueAtom(0));
      const atom2 = new LastDayOfWeekAtom(new DayOfWeekValueAtom(4));
      const date = DateTime.local(2020, 8, 15);

      expect(atom1.getNextDateAfter(date)).toEqual(date.set({ day: 30 }));
      expect(atom2.getNextDateAfter(date)).toEqual(date.set({ day: 27 }));
    });

    it("returns null if the provided date occurs on or after the last nth day of the month", () => {
      const atom = new LastDayOfWeekAtom(new DayOfWeekValueAtom(4));
      const date1 = DateTime.local(2020, 8, 27);
      const date2 = DateTime.local(2020, 8, 29);

      expect(atom.getNextDateAfter(date1)).toBe(null);
      expect(atom.getNextDateAfter(date2)).toBe(null);
    });

    it("returns true if the provided date is the last matching weekday in the month", () => {
      const atom1 = new LastDayOfWeekAtom(new DayOfWeekValueAtom(4));
      const date1 = DateTime.local(2020, 8, 27);
      const atom2 = new LastDayOfWeekAtom(new DayOfWeekValueAtom(0));
      const date2 = DateTime.local(2020, 8, 30);

      expect(atom1.isValid(date1)).toBe(true);
      expect(atom2.isValid(date2)).toBe(true);
    });

    it("returns false if the provided date is not the last matching weekday in the month", () => {
      const atom1 = new LastDayOfWeekAtom(new DayOfWeekValueAtom(4));
      const date1 = DateTime.local(2020, 8, 29);
      const atom2 = new LastDayOfWeekAtom(new DayOfWeekValueAtom(0));
      const date2 = DateTime.local(2020, 8, 16);

      expect(atom1.isValid(date1)).toBe(false);
      expect(atom2.isValid(date2)).toBe(false);
    });
  });

  describe("Nth Day of Week atom", () => {
    it("throws a RangeError if the provided day of week is outside of the valid range", () => {
      expect(() => new NthDayOfWeekAtom(new DayOfWeekValueAtom(-1), 3)).toThrow(
        RangeError
      );
      expect(() => new NthDayOfWeekAtom(new DayOfWeekValueAtom(7), 3)).toThrow(
        RangeError
      );
    });

    it("throws a RangeError if the provided ordinal is outside of the valid range", () => {
      expect(() => new NthDayOfWeekAtom(new DayOfWeekValueAtom(2), 0)).toThrow(
        RangeError
      );
      expect(() => new NthDayOfWeekAtom(new DayOfWeekValueAtom(2), 6)).toThrow(
        RangeError
      );
    });

    it("returns the nth occurrence of the weekday in the provided date's month", () => {
      const atom1 = new NthDayOfWeekAtom(new DayOfWeekValueAtom(5), 4);
      const atom2 = new NthDayOfWeekAtom(new DayOfWeekValueAtom(0), 2);
      const atom3 = new NthDayOfWeekAtom(new DayOfWeekValueAtom(2), 3);
      const atom4 = new NthDayOfWeekAtom(new DayOfWeekValueAtom(1), 5);
      const date = DateTime.local(2020, 8, 4);

      expect(atom1.getNextDateAfter(date)).toEqual(date.set({ day: 28 }));
      expect(atom2.getNextDateAfter(date)).toEqual(date.set({ day: 9 }));
      expect(atom3.getNextDateAfter(date)).toEqual(date.set({ day: 18 }));
      expect(atom4.getNextDateAfter(date)).toEqual(date.set({ day: 31 }));
    });

    it("returns null if the provided date is after the nth weekday of that month", () => {
      const atom = new NthDayOfWeekAtom(new DayOfWeekValueAtom(2), 3);
      const date = DateTime.local(2020, 8, 20);

      expect(atom.getNextDateAfter(date)).toBe(null);
    });

    it("returns null if the nth weekday does not exist in that month", () => {
      const atom = new NthDayOfWeekAtom(new DayOfWeekValueAtom(2), 5);
      const date = DateTime.local(2020, 8, 1);

      expect(atom.getNextDateAfter(date)).toBe(null);
    });

    it("returns true if the provided date is the nth weekday of the month", () => {
      const atom1 = new NthDayOfWeekAtom(new DayOfWeekValueAtom(2), 3);
      const date1 = DateTime.local(2020, 8, 18);
      const atom2 = new NthDayOfWeekAtom(new DayOfWeekValueAtom(0), 5);
      const date2 = DateTime.local(2020, 8, 30);

      expect(atom1.isValid(date1)).toBe(true);
      expect(atom2.isValid(date2)).toBe(true);
    });

    it("returns false if the provided date is not the nth weekday of the month", () => {
      const atom1 = new NthDayOfWeekAtom(new DayOfWeekValueAtom(2), 3);
      const date1 = DateTime.local(2020, 8, 25);
      const atom2 = new NthDayOfWeekAtom(new DayOfWeekValueAtom(0), 5);
      const date2 = DateTime.local(2020, 8, 29);

      expect(atom1.isValid(date1)).toBe(false);
      expect(atom2.isValid(date2)).toBe(false);
    });
  });
});
