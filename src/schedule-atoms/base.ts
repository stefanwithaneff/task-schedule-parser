import { InvalidRangeError } from "./errors";

export interface ScheduleAtom {
  getNextDateAfter(date: Date): Date | null;
  isValid(date: Date): boolean;
  toString(): string;
}

export class ValueAtom implements ScheduleAtom {
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

  getDateValue(date: Date) {
    return -1;
  }

  calculateNextDate(date: Date, dateValue: number) {
    return date;
  }

  getNextDateAfter(date: Date) {
    const dateValue = this.getDateValue(date);

    if (dateValue < this.value) {
      return this.calculateNextDate(date, this.value);
    }

    return null;
  }

  isValid(date: Date) {
    const dateValue = this.getDateValue(date);

    return dateValue === this.value;
  }

  toString() {
    return `Value(${this.value})`;
  }
}

export class RangeAtom implements ScheduleAtom {
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

    if (max < min) {
      throw new InvalidRangeError(
        `Min range value cannot be higher than the max value for ${this.constructor.name}. Min: ${min}, Max: ${max}`
      );
    }

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

    this.min = min;
    this.max = max;
    this.step = step;
  }

  getDateValue(date: Date) {
    return -1;
  }

  // Used for Day of Month to handle the variation in number of days from month to month
  getMaxDateValue(date: Date) {
    return Infinity;
  }

  calculateNextDate(date: Date, value: number) {
    return date;
  }

  getNextDateAfter(date: Date) {
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

  isValid(date: Date) {
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
