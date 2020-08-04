import { Success } from "parsimmon";
import { Minutes } from "../minutes";

describe("Minutes parsing", () => {
  it("should parse a single value", () => {
    const result = Minutes.parse("42") as Success<any>;

    expect(result.status).toBe(true);
    expect(result.value.toString()).toBe("Value(42)");
  });

  it("should fail to parse a value outside of 0-59", () => {
    const result = Minutes.parse("60");

    expect(result.status).toBe(false);
  });

  it("should parse a range of values", () => {
    const result = Minutes.parse("5-25") as Success<any>;

    expect(result.status).toBe(true);
    expect(result.value.toString()).toBe("Range(5-25)");
  });

  it("should parse a wildcard as the full range of values", () => {
    const result = Minutes.parse("*") as Success<any>;

    expect(result.status).toBe(true);
    expect(result.value.toString()).toBe("Range(0-59)");
  });

  it("should parse a stepped range of values", () => {
    const result = Minutes.parse("2-24/2") as Success<any>;

    expect(result.status).toBe(true);
    expect(result.value.toString()).toBe("Range(2-24/2)");
  });

  it("should parse a stepped range for a wildcard", () => {
    const result = Minutes.parse("*/5") as Success<any>;

    expect(result.status).toBe(true);
    expect(result.value.toString()).toBe("Range(0-59/5)");
  });

  it("should parse a list of minute values", () => {
    const result = Minutes.parse("2,3-15/3,19,23-35") as Success<any>;

    expect(result.status).toBe(true);
    expect(result.value.toString()).toBe(
      "OR(Value(2),Range(3-15/3),Value(19),Range(23-35))"
    );
  });
});
