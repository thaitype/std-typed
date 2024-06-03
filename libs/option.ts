import type { ToStringOptions } from "./core";
/**
 * Rust inspired Option type for TypeScript
 */

export type Option<T> = _Some<T> | _None<T>;
export type _OptionTag = "some" | "none";

export abstract class OptionBase<T> {
  protected readonly _tag: _OptionTag = "some";

  isSome(): this is _Some<T> {
    return this._tag === "some";
  }

  isNone(): this is _None {
    return this._tag === "none";
  }

  /**
   * Simple pattern matching for Result, for more complex matching use external libraries like `ts-pattern`
   * @param pattern
   * @returns
   */
  match<U>(pattern: { some: (value: T) => U; none: () => U }): U {
    return this.isSome() ? pattern.some(this.unwrap()) : pattern.none();
  }

  /**
   * Converts the Option to an object for type-safe pattern matching
   * @returns
   */
  toObject(): { _tag: "some"; value: T } | { _tag: "none" } {
    return this.isSome()
      ? { _tag: "some", value: this.unwrap() }
      : { _tag: "none" };
  }

  toString(options?: ToStringOptions): string {
    if (this.isSome()) {
      const stringifiedValue =
        options?.pretty === true
          ? JSON.stringify(this.unwrap(), null, 2)
          : JSON.stringify(this.unwrap());
      return `Some(${stringifiedValue})`;
    }
    return "None";
  }

  static getTag(): {
    _tag: _OptionTag;
  } {
    throw new Error("Method not implemented.");
  }
}

export class _Some<T> extends OptionBase<T> {
  protected readonly _tag = "some";
  constructor(public value: T) {
    super();
  }

  unwrap(): T {
    return this.value;
  }

  static getTag(): { _tag: "some" } {
    return { _tag: "some" };
  }
}

export class _None<T = never> extends OptionBase<T> {
  protected readonly _tag = "none";

  static getTag(): { _tag: "none" } {
    return { _tag: "none" };
  }
}

// ------------ Helper functions ------------

export function some<T>(value: T): _Some<T> {
  return new _Some(value);
}
export const none: _None = new _None();
export const Some = _Some.getTag();
export const None = _None.getTag();
