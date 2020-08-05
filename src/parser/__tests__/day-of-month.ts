import { Success } from "parsimmon";
import { DayOfMonth } from "../day-of-month";

describe("DayOfMonth parsing", () => {
  it("parses a single value", () => {
    const result = DayOfMonth.parse("15") as Success<any>;

    expect(result.status).toBe(true);
    expect(result.value.toString()).toBe("Value(15)");
  });

  it("parses a range of values", () => {
    const result = DayOfMonth.parse("5-25") as Success<any>;

    expect(result.status).toBe(true);
    expect(result.value.toString()).toBe("Range(5-25)");
  });

  it("parses a wildcard as the full range of values", () => {
    const result = DayOfMonth.parse("*") as Success<any>;

    expect(result.status).toBe(true);
    expect(result.value.toString()).toBe("Range(1-31)");
  });

  it("parses a stepped range of values", () => {
    const result = DayOfMonth.parse("2-24/2") as Success<any>;

    expect(result.status).toBe(true);
    expect(result.value.toString()).toBe("Range(2-24/2)");
  });

  it("parses a stepped range for a wildcard", () => {
    const result = DayOfMonth.parse("*/5") as Success<any>;

    expect(result.status).toBe(true);
    expect(result.value.toString()).toBe("Range(1-31/5)");
  });

  it("parses a weekday value", () => {
    const result = DayOfMonth.parse("15W") as Success<any>;

    expect(result.status).toBe(true);
    expect(result.value.toString()).toBe("Weekday(15)");
  });

  it("parses a last day of month value", () => {
    const result = DayOfMonth.parse("L") as Success<any>;

    expect(result.status).toBe(true);
    expect(result.value.toString()).toBe("LastOfMonth(0)");
  });

  it("parses a last day of month value with an offset", () => {
    const result = DayOfMonth.parse("L-5") as Success<any>;

    expect(result.status).toBe(true);
    expect(result.value.toString()).toBe("LastOfMonth(5)");
  });

  it("parses a last weekday of month value", () => {
    const result = DayOfMonth.parse("LW") as Success<any>;

    expect(result.status).toBe(true);
    expect(result.value.toString()).toBe("Weekday(31)");
  });

  it("parses a question mark as a noop", () => {
    const result = DayOfMonth.parse("?") as Success<any>;

    expect(result.status).toBe(true);
    expect(result.value.toString()).toBe("Noop");
  });

  it("parses a list of minute values", () => {
    const result = DayOfMonth.parse("2,3-15/3,16W,L-5") as Success<any>;

    expect(result.status).toBe(true);
    expect(result.value.toString()).toBe(
      "OR(Value(2),Range(3-15/3),Weekday(16),LastOfMonth(5))"
    );
  });
});
