import { Success } from "parsimmon";
import { Cron } from "../cron";

describe("Cron parser", () => {
  it("parses a 5-part cron expression", () => {
    const expression = "* * * * *";
    const result = Cron.parse(expression) as Success<any>;

    expect(result.status).toBe(true);
    expect(result.value.minutes.toString()).toEqual("Range(0-59)");
    expect(result.value.hours.toString()).toEqual("Range(0-23)");
    expect(result.value.days.toString()).toEqual("OR(Range(1-31),Range(0-6))");
    expect(result.value.months.toString()).toEqual("Range(1-12)");
  });

  it("fails to parse an incomplete cron expression", () => {
    const expression = "* * * *";
    const result = Cron.parse(expression);

    expect(result.status).toBe(false);
  });
});
