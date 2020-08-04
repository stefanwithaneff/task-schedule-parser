import { setMinutes } from "date-fns";
import { InvalidRangeError } from "../errors";
import { MinuteValueAtom, MinuteRangeAtom } from "../minutes";

describe("Base Scheduling Atoms", () => {
  describe("Value Atom", () => {
    it("throws a RangeError when providing a value below the minimum", () => {
      expect(() => new MinuteValueAtom(-1)).toThrow(RangeError);
    });

    it("throws a RangeError when providing a value greater than the maximum", () => {
      expect(() => new MinuteValueAtom(60)).toThrow(RangeError);
    });

    it("returns the date with the provided value if the given date is before the provided value", () => {
      const atom = new MinuteValueAtom(35);
      const date = new Date(2020, 7, 1, 0, 30);

      expect(atom.getNextDateAfter(date)).toEqual(setMinutes(date, 35));
    });

    it("returns null if the provided value is equal to the given date", () => {
      const atom = new MinuteValueAtom(35);
      const date = new Date(2020, 7, 1, 0, 35);

      expect(atom.getNextDateAfter(date)).toBe(null);
    });

    it("returns null if the given date is after the provided value", () => {
      const atom = new MinuteValueAtom(35);
      const date = new Date(2020, 7, 1, 0, 36);

      expect(atom.getNextDateAfter(date)).toBe(null);
    });

    it("returns true if the provided value matches the given date", () => {
      const atom = new MinuteValueAtom(35);
      const date = new Date(2020, 7, 1, 0, 35);

      expect(atom.isValid(date)).toBe(true);
    });

    it("returns false if the provided value does not match the given date", () => {
      const atom = new MinuteValueAtom(35);
      const date = new Date(2020, 7, 1, 0, 34);

      expect(atom.isValid(date)).toBe(false);
    });
  });

  describe("Range Atom", () => {
    it("throws a RangeError when providing a value below the minimum", () => {
      expect(() => new MinuteRangeAtom(-1, 42)).toThrow(RangeError);
    });

    it("throws a RangeError when providing a value above the maximum", () => {
      expect(() => new MinuteRangeAtom(32, 72)).toThrow(RangeError);
    });

    it("throws a RangeError when the provided step value is less than 1", () => {
      expect(() => new MinuteRangeAtom(0, 30, 0)).toThrow(RangeError);
    });

    it("throws a RangeError when the provided step value is greater than the max", () => {
      expect(() => new MinuteRangeAtom(0, 30, 65)).toThrow(RangeError);
    });

    it("throws an InvalidRangeError when providing a minimum value that is greater than the maximum value", () => {
      expect(() => new MinuteRangeAtom(44, 11)).toThrow(InvalidRangeError);
    });

    it("returns the next date after the provided date that is valid for the provided range of values", () => {
      const atom = new MinuteRangeAtom(15, 30);
      const date = new Date(2020, 8, 1, 0, 17);

      expect(atom.getNextDateAfter(date)).toEqual(setMinutes(date, 18));
    });

    it("returns the first date to match the range if the provided date is before the range", () => {
      const atom = new MinuteRangeAtom(15, 30);
      const date = new Date(2020, 8, 1, 0, 9);

      expect(atom.getNextDateAfter(date)).toEqual(setMinutes(date, 15));
    });

    it("returns null if the provided date is equal to the max of the range", () => {
      const atom = new MinuteRangeAtom(15, 30);
      const date = new Date(2020, 8, 1, 0, 30);

      expect(atom.getNextDateAfter(date)).toEqual(null);
    });

    it("returns null if the provided date is after the range of values", () => {
      const atom = new MinuteRangeAtom(15, 30);
      const date = new Date(2020, 8, 1, 0, 35);

      expect(atom.getNextDateAfter(date)).toEqual(null);
    });

    it("returns the date with the next stepped value in the range if a step is provided", () => {
      const atom = new MinuteRangeAtom(15, 30, 5);
      const date = new Date(2020, 8, 1, 0, 17);

      expect(atom.getNextDateAfter(date)).toEqual(setMinutes(date, 20));
    });

    it("returns the date with the next stepped value if the stepped value is equal to the max of the range", () => {
      const atom = new MinuteRangeAtom(15, 30, 5);
      const date = new Date(2020, 8, 1, 0, 27);

      expect(atom.getNextDateAfter(date)).toEqual(setMinutes(date, 30));
    });

    it("returns true if the provided date has a value within the provided range", () => {
      const atom = new MinuteRangeAtom(15, 30);
      const date = new Date(2020, 8, 1, 0, 27);

      expect(atom.isValid(date)).toBe(true);
    });

    it("returns false if the provided date has a value before the provided range", () => {
      const atom = new MinuteRangeAtom(15, 30);
      const date = new Date(2020, 8, 1, 0, 12);

      expect(atom.isValid(date)).toBe(false);
    });

    it("returns false if the provided date has a value after the provided range", () => {
      const atom = new MinuteRangeAtom(15, 30);
      const date = new Date(2020, 8, 1, 0, 35);

      expect(atom.isValid(date)).toBe(false);
    });

    it("returns false if the provided date has a value within the range but does not match the provided step", () => {
      const atom = new MinuteRangeAtom(15, 30, 5);
      const date = new Date(2020, 8, 1, 0, 19);

      expect(atom.isValid(date)).toBe(false);
    });
  });
});
