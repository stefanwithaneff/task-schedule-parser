import { Success } from "parsimmon";
import { Minutes } from "../minutes";

describe("Minutes parsing", () => {
  it("parses a single value", () => {
    const result = Minutes.parse("42") as Success<any>;

    expect(result.status).toBe(true);
    expect(result.value.toString()).toBe("Value(42)");
  });

  it("parses a range of values", () => {
    const result = Minutes.parse("5-25") as Success<any>;

    expect(result.status).toBe(true);
    expect(result.value.toString()).toBe("Range(5-25)");
  });

  it("parses a wildcard as the full range of values", () => {
    const result = Minutes.parse("*") as Success<any>;

    expect(result.status).toBe(true);
    expect(result.value.toString()).toBe("Range(0-59)");
  });

  it("parses a stepped range of values", () => {
    const result = Minutes.parse("2-24/2") as Success<any>;

    expect(result.status).toBe(true);
    expect(result.value.toString()).toBe("Range(2-24/2)");
  });

  it("parses a stepped range for a wildcard", () => {
    const result = Minutes.parse("*/5") as Success<any>;

    expect(result.status).toBe(true);
    expect(result.value.toString()).toBe("Range(0-59/5)");
  });

  it("parses a list of minute values", () => {
    const result = Minutes.parse("2,3-15/3,19,23-35") as Success<any>;

    expect(result.status).toBe(true);
    expect(result.value.toString()).toBe(
      "OR(Value(2),Range(3-15/3),Value(19),Range(23-35))"
    );
  });
});
