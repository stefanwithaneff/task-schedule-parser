import { Success } from "parsimmon";
import { Months } from "../months";

describe("Months parsing", () => {
  it("parses a single value", () => {
    const result = Months.parse("2") as Success<any>;

    expect(result.status).toBe(true);
    expect(result.value.toString()).toBe("Value(2)");
  });

  it("parses a range of values", () => {
    const result = Months.parse("3-7") as Success<any>;

    expect(result.status).toBe(true);
    expect(result.value.toString()).toBe("Range(3-7)");
  });

  it("parses a wildcard as the full range of values", () => {
    const result = Months.parse("*") as Success<any>;

    expect(result.status).toBe(true);
    expect(result.value.toString()).toBe("Range(1-12)");
  });

  it("parses a stepped range of values", () => {
    const result = Months.parse("2-8/2") as Success<any>;

    expect(result.status).toBe(true);
    expect(result.value.toString()).toBe("Range(2-8/2)");
  });

  it("parses a stepped range for a wildcard", () => {
    const result = Months.parse("*/5") as Success<any>;

    expect(result.status).toBe(true);
    expect(result.value.toString()).toBe("Range(1-12/5)");
  });

  it("parses a list of minute values", () => {
    const result = Months.parse("2,3-9/3,10,11-12") as Success<any>;

    expect(result.status).toBe(true);
    expect(result.value.toString()).toBe(
      "OR(Value(2),Range(3-9/3),Value(10),Range(11-12))"
    );
  });
});
