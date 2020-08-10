import { DateTime } from "luxon";
import { Scheduler } from "../scheduler";
import { NextDateNotFoundError } from "../errors";

describe("Scheduler", () => {
  it("returns the next date that matches the provided minutes", () => {
    const cronExpression = "3-15/3,18,32 * * * *";
    const scheduler = new Scheduler({ cronExpression });
    const date = new Date(2020, 8, 1, 0, 3);

    expect(scheduler.getNextDateAfter(date)).toEqual(
      new Date(2020, 8, 1, 0, 6)
    );
  });

  it("increments to the next valid hour if there are no further matching minutes in the given hour", () => {
    const cronExpression = "3-15/3,18,32 * * * *";
    const scheduler = new Scheduler({ cronExpression });
    const date = new Date(2020, 8, 1, 0, 32);

    expect(scheduler.getNextDateAfter(date)).toEqual(
      new Date(2020, 8, 1, 1, 3)
    );
  });

  it("returns the next date that matches the provided hours", () => {
    const cronExpression = "0 1-5/2,8,22 * * *";
    const scheduler = new Scheduler({ cronExpression });
    const date = new Date(2020, 8, 1, 5);

    expect(scheduler.getNextDateAfter(date)).toEqual(new Date(2020, 8, 1, 8));
  });

  it("increments to the next valid day if there are no further matching hours in the given day", () => {
    const cronExpression = "30 1-5/2,8,22 * * *";
    const scheduler = new Scheduler({ cronExpression });
    const date = new Date(2020, 8, 1, 22, 30);

    expect(scheduler.getNextDateAfter(date)).toEqual(
      new Date(2020, 8, 2, 1, 30)
    );
  });

  it("returns the next date that matches the provided day of month", () => {
    const cronExpression = "30 8 1-3,12W,L-4 * ?";
    const scheduler = new Scheduler({ cronExpression });
    const date = new Date(2020, 8, 10, 8, 30);

    expect(scheduler.getNextDateAfter(date)).toEqual(
      new Date(2020, 8, 11, 8, 30)
    );
  });

  it("increments to the next valid month if there are no further matching days in the given month", () => {
    const cronExpression = "30 8 3-7,12W,L-4 * ?";
    const scheduler = new Scheduler({ cronExpression });
    const date = new Date(2020, 8, 27, 8, 30);

    expect(scheduler.getNextDateAfter(date)).toEqual(
      new Date(2020, 9, 3, 8, 30)
    );
  });

  it("returns the next date that matches the provided month", () => {
    const cronExpression = "30 8 5 2-4,7,12 ?";
    const scheduler = new Scheduler({ cronExpression });
    const date = new Date(2020, 8, 5, 8, 30);

    expect(scheduler.getNextDateAfter(date)).toEqual(
      new Date(2020, 11, 5, 8, 30)
    );
  });

  it("increments to the next valid year if there are no further matching months in the given year", () => {
    const cronExpression = "30 8 5 2-4,7,12 ?";
    const scheduler = new Scheduler({ cronExpression });
    const date = new Date(2020, 11, 5, 8, 30);

    expect(scheduler.getNextDateAfter(date)).toEqual(
      new Date(2021, 1, 5, 8, 30)
    );
  });

  it("handles scheduling based on the provided timezone", () => {
    const cronExpression = "0 4 * * *";
    const scheduler = new Scheduler({ cronExpression });
    const date = new Date(Date.UTC(2020, 8, 1, 4));

    // Given date converts to 2020-09-01 04:00:00+1:00
    // The next occurence of 4AM in this tz is 2020-09-02 04:00:00+1:00
    // Subtracting the offset to get the UTC date gives 2020-09-02 03:00:00+0:00
    expect(scheduler.getNextDateAfter(date, "UTC+1")).toEqual(
      new Date(Date.UTC(2020, 8, 2, 3))
    );
  });

  it("handles non-hour offsets for timezones", () => {
    // Asia/Kathmandu is UTC+5:45
    const tz = "Asia/Kathmandu";
    const cronExpression = "0 4 * * *";
    const scheduler = new Scheduler({ cronExpression });
    const date = DateTime.fromObject({
      year: 2020,
      month: 9,
      day: 1,
      hour: 9,
      zone: tz,
    }).toJSDate();
    const expectedDate = DateTime.fromObject({
      year: 2020,
      month: 9,
      day: 2,
      hour: 4,
      zone: tz,
    }).toJSDate();

    expect(scheduler.getNextDateAfter(date, tz)).toEqual(expectedDate);
  });

  it("skips the hour when daylight savings time begins", () => {
    const tz = "America/New_York";
    const cronExpression = "0 2 * * *";
    const scheduler = new Scheduler({ cronExpression });
    const date = DateTime.fromObject({
      year: 2020,
      month: 3,
      day: 8,
      hour: 1,
      zone: tz,
    }).toJSDate();
    const expectedDate = DateTime.fromObject({
      year: 2020,
      month: 3,
      day: 9,
      hour: 2,
      zone: tz,
    }).toJSDate();

    expect(scheduler.getNextDateAfter(date, tz)).toEqual(expectedDate);
  });

  it("only executes once for specified values when the time is set backward for the end of DST", () => {
    const tz = "America/New_York";
    const cronExpression = "0 1 * * *";
    const scheduler = new Scheduler({ cronExpression });
    const date = DateTime.fromObject({
      year: 2020,
      month: 11,
      day: 1,
      hour: 0,
      zone: tz,
    }).toJSDate();
    const expectedDate = DateTime.fromObject({
      year: 2020,
      month: 11,
      day: 1,
      hour: 1,
      zone: tz,
    }).toJSDate();
    const nextExpectedDate = DateTime.fromObject({
      year: 2020,
      month: 11,
      day: 2,
      hour: 1,
      zone: tz,
    }).toJSDate();

    expect(scheduler.getNextDateAfter(date, tz)).toEqual(expectedDate);

    expect(scheduler.getNextDateAfter(expectedDate, tz)).toEqual(
      nextExpectedDate
    );
  });

  it("executes twice for single-step ranges when the time is set backward for the end of DST", () => {
    const tz = "America/New_York";
    const cronExpression = "0 0-4 * * *";
    const scheduler = new Scheduler({ cronExpression });
    const date = DateTime.fromObject({
      year: 2020,
      month: 11,
      day: 1,
      hour: 0,
      zone: tz,
    }).toJSDate();
    const expectedDate = DateTime.fromObject({
      year: 2020,
      month: 11,
      day: 1,
      hour: 1,
      zone: tz,
    }).toJSDate();
    const nextExpectedDate = DateTime.fromISO("2020-11-01T01:00:00-05:00", {
      zone: tz,
    }).toJSDate();

    expect(scheduler.getNextDateAfter(date, tz)).toEqual(expectedDate);

    expect(scheduler.getNextDateAfter(expectedDate, tz)).toEqual(
      nextExpectedDate
    );
  });

  it("throws an error if the provided cron expression is invalid", () => {
    expect(() => new Scheduler({ cronExpression: "* * * *" })).toThrow();
  });

  it("throws a NextDateNotFound error if a next date cannot be found for the provided schedule", () => {
    const scheduler = new Scheduler({ cronExpression: "* * 31 2 ?" });

    expect(() => scheduler.getNextDateAfter(new Date())).toThrow(
      NextDateNotFoundError
    );
  });
});
