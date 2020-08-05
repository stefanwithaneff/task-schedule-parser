import { Success } from "parsimmon";
import { Hours } from "../hours";

describe("Hours parsing", () => {
  it("parses a single value", () => {
    const result = Hours.parse("18") as Success<any>;

    expect(result.status).toBe(true);
    expect(result.value.toString()).toBe("Value(18)");
  });

  it("parses a range of values", () => {
    const result = Hours.parse("2-19") as Success<any>;

    expect(result.status).toBe(true);
    expect(result.value.toString()).toBe("Range(2-19)");
  });

  it("parses a wildcard as the full range of values", () => {
    const result = Hours.parse("*") as Success<any>;

    expect(result.status).toBe(true);
    expect(result.value.toString()).toBe("Range(0-23)");
  });

  it("parses a stepped range of values", () => {
    const result = Hours.parse("1-14/2") as Success<any>;

    expect(result.status).toBe(true);
    expect(result.value.toString()).toBe("Range(1-14/2)");
  });

  it("parses a stepped range for a wildcard", () => {
    const result = Hours.parse("*/4") as Success<any>;

    expect(result.status).toBe(true);
    expect(result.value.toString()).toBe("Range(0-23/4)");
  });

  it("parses a list of hour values", () => {
    const result = Hours.parse("2,3-15/3,19,21-23") as Success<any>;

    expect(result.status).toBe(true);
    expect(result.value.toString()).toBe(
      "OR(Value(2),Range(3-15/3),Value(19),Range(21-23))"
    );
  });
});
