import { Success } from "parsimmon";
import { DayOfWeek } from "../day-of-week";

describe("DayOfWeek parsing", () => {
  it("parses a single value", () => {
    const result = DayOfWeek.parse("5") as Success<any>;

    expect(result.status).toBe(true);
    expect(result.value.toString()).toBe("Value(5)");
  });

  it("parses a range of values", () => {
    const result = DayOfWeek.parse("1-4") as Success<any>;

    expect(result.status).toBe(true);
    expect(result.value.toString()).toBe("Range(1-4)");
  });

  it("parses a wildcard as the full range of values", () => {
    const result = DayOfWeek.parse("*") as Success<any>;

    expect(result.status).toBe(true);
    expect(result.value.toString()).toBe("Range(0-6)");
  });

  it("parses a last weekday of month", () => {
    const result = DayOfWeek.parse("5L") as Success<any>;

    expect(result.status).toBe(true);
    expect(result.value.toString()).toBe("LastDayOfWeek(5)");
  });

  it("parses an nth weekday of the month", () => {
    const result = DayOfWeek.parse("3#4") as Success<any>;

    expect(result.status).toBe(true);
    expect(result.value.toString()).toBe("NthDayOfWeek(3,4)");
  });

  it("parses a list of minute values", () => {
    const result = DayOfWeek.parse("1,3-4,5#3,6L") as Success<any>;

    expect(result.status).toBe(true);
    expect(result.value.toString()).toBe(
      "OR(Value(1),Range(3-4),NthDayOfWeek(5,3),LastDayOfWeek(6))"
    );
  });
});
