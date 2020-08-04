import { Success } from "parsimmon";
import { Hours } from "../hours";

describe("Hours parsing", () => {
  it("should parse a single value", () => {
    const result = Hours.parse("18") as Success<any>;

    expect(result.status).toBe(true);
    expect(result.value.toString()).toBe("Value(18)");
  });

  it("should fail to parse a value outside of 0-23", () => {
    const result = Hours.parse("24");

    expect(result.status).toBe(false);
  });

  it("should parse a range of values", () => {
    const result = Hours.parse("2-19") as Success<any>;

    expect(result.status).toBe(true);
    expect(result.value.toString()).toBe("Range(2-19)");
  });

  it("should parse a wildcard as the full range of values", () => {
    const result = Hours.parse("*") as Success<any>;

    expect(result.status).toBe(true);
    expect(result.value.toString()).toBe("Range(0-23)");
  });

  it("should parse a stepped range of values", () => {
    const result = Hours.parse("1-14/2") as Success<any>;

    expect(result.status).toBe(true);
    expect(result.value.toString()).toBe("Range(1-14/2)");
  });

  it("should parse a stepped range for a wildcard", () => {
    const result = Hours.parse("*/4") as Success<any>;

    expect(result.status).toBe(true);
    expect(result.value.toString()).toBe("Range(0-23/4)");
  });

  it("should parse a list of hour values", () => {
    const result = Hours.parse("2,3-15/3,19,21-23") as Success<any>;

    expect(result.status).toBe(true);
    expect(result.value.toString()).toBe(
      "OR(Value(2),Range(3-15/3),Value(19),Range(21-23))"
    );
  });
});
