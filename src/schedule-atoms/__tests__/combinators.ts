import { OrAtom } from "../combinators";
import { DateTime } from "luxon";
import { MinuteValueAtom } from "../minutes";

describe("Combinator Scheduling atoms", () => {
  describe("OR atom", () => {
    it("returns the earliest result of the provided atoms' getNextDateAfter functions", () => {
      const atom1 = new MinuteValueAtom(5);
      const atom2 = new MinuteValueAtom(17);
      const atom3 = new MinuteValueAtom(32);
      const orAtom = new OrAtom([atom1, atom2, atom3]);
      const date = DateTime.local(2020, 8, 1, 0, 1);

      expect(orAtom.getNextDateAfter(date)).toEqual(date.set({ minute: 5 }));
    });

    it("filters out atoms that do not have a valid next date after the provided one", () => {
      const atom1 = new MinuteValueAtom(5);
      const atom2 = new MinuteValueAtom(17);
      const atom3 = new MinuteValueAtom(32);
      const orAtom = new OrAtom([atom1, atom2, atom3]);
      const date = DateTime.local(2020, 8, 1, 0, 8);

      expect(orAtom.getNextDateAfter(date)).toEqual(date.set({ minute: 17 }));
    });

    it("returns null if none of the provided atoms have a valid next date", () => {
      const atom1 = new MinuteValueAtom(5);
      const atom2 = new MinuteValueAtom(17);
      const atom3 = new MinuteValueAtom(32);
      const orAtom = new OrAtom([atom1, atom2, atom3]);
      const date = DateTime.local(2020, 8, 1, 0, 33);

      expect(orAtom.getNextDateAfter(date)).toBe(null);
    });
  });
});
