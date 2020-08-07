import { DateTime } from "luxon";
import { InvalidRangeError } from "./errors";

export interface ScheduleAtom {
  getNextDateAfter(date: DateTime): DateTime | null;
  isValid(date: DateTime): boolean;
  toString(): string;
}

export abstract class ValueAtom implements ScheduleAtom {
  static MIN_VALUE = 0;
  static MAX_VALUE = Infinity;
  readonly value: number;

  constructor(value: number) {
    const { MIN_VALUE, MAX_VALUE } = this.constructor as any;
    if (value < MIN_VALUE || value > MAX_VALUE) {
      throw new RangeError(
        `Invalid value for ${this.constructor.name}: ${value}. Must be between ${MIN_VALUE} and ${MAX_VALUE}`
      );
    }
    this.value = value;
  }

  abstract getDateValue(date: DateTime): number;

  // Used for Day of Month to handle the variation in number of days from month to month
  getMaxDateValue(date: DateTime) {
    return Infinity;
  }

  abstract calculateNextDate(date: DateTime, dateValue: number): DateTime;

  getNextDateAfter(date: DateTime) {
    const dateValue = this.getDateValue(date);

    if (dateValue < this.value && this.value <= this.getMaxDateValue(date)) {
      return this.calculateNextDate(date, this.value);
    }

    return null;
  }

  isValid(date: DateTime) {
    const dateValue = this.getDateValue(date);

    return dateValue === this.value;
  }

  toString() {
    return `Value(${this.value})`;
  }
}

export abstract class RangeAtom implements ScheduleAtom {
  static MIN_VALUE = 0;
  static MAX_VALUE = Infinity;
  readonly min: number;
  readonly max: number;
  readonly step: number;

  constructor(
    minAtom: ValueAtom | number,
    maxAtom: ValueAtom | number,
    step = 1
  ) {
    const min = minAtom instanceof ValueAtom ? minAtom.value : minAtom;
    const max = maxAtom instanceof ValueAtom ? maxAtom.value : maxAtom;

    const { MIN_VALUE, MAX_VALUE } = this.constructor as any;

    if (min < MIN_VALUE) {
      throw new RangeError(
        `Invalid minimum value for ${this.constructor.name}: ${min}. Must be between ${MIN_VALUE} and ${MAX_VALUE}`
      );
    }

    if (max > MAX_VALUE) {
      throw new RangeError(
        `Invalid maximum value for ${this.constructor.name}: ${max}. Must be between ${MIN_VALUE} and ${MAX_VALUE}`
      );
    }

    if (step < 1 || step > MAX_VALUE) {
      throw new RangeError(
        `Invalid step value for ${this.constructor.name}: ${step}. Must be between 1 and ${MAX_VALUE}`
      );
    }

    if (max < min) {
      throw new InvalidRangeError(
        `Min range value cannot be higher than the max value for ${this.constructor.name}. Min: ${min}, Max: ${max}`
      );
    }

    this.min = min;
    this.max = max;
    this.step = step;
  }

  abstract getDateValue(date: DateTime): number;

  // Used for Day of Month to handle the variation in number of days from month to month
  getMaxDateValue(date: DateTime) {
    return Infinity;
  }

  abstract calculateNextDate(date: DateTime, value: number): DateTime;

  getNextDateAfter(date: DateTime) {
    const dateValue = this.getDateValue(date);
    const maxDateValue = this.getMaxDateValue(date);

    if (dateValue < this.min) {
      return this.calculateNextDate(date, this.min);
    }

    const nextStepValue =
      Math.ceil((dateValue - this.min + 1) / this.step) * this.step + this.min;

    if (nextStepValue > this.max || nextStepValue > maxDateValue) {
      return null;
    }

    return this.calculateNextDate(date, nextStepValue);
  }

  isValid(date: DateTime) {
    const minute = this.getDateValue(date);

    return (
      minute >= this.min &&
      minute <= this.max &&
      (minute - this.min) % this.step === 0
    );
  }

  toString() {
    return `Range(${this.min}-${this.max}${
      this.step > 1 ? `/${this.step}` : ""
    })`;
  }
}

export class NoopAtom implements ScheduleAtom {
  getNextDateAfter(date: DateTime) {
    return null;
  }

  isValid(date: DateTime) {
    return false;
  }

  toString() {
    return "Noop";
  }
}
