import type { ToStringOptions } from "./types.js";
/**
 * Rust inspired Option type for TypeScript
 */

export type Option<T> = Some<T> | None<T>;
export type _OptionTag = "some" | "none";

export abstract class OptionBase<T> {
  protected readonly _tag: _OptionTag = "some";

  isSome(): this is Some<T> {
    return this._tag === "some";
  }

  isNone(): this is None {
    return this._tag === "none";
  }

  /**
   * Simple pattern matching for Result, for more complex matching use external libraries like `ts-pattern`
   * @param pattern
   * @returns
   */
  match<U>(pattern: {
    /** When the Option is Some, it will call the `some` function with the value */
    some: (value: T) => U;
    /** When the Option is None, it will call the `none` function */
    none: () => U;
  }): U {
    return this.isSome() ? pattern.some(this.unwrap()) : pattern.none();
  }

  /**
   * Converts the Option to an object for type-safe pattern matching
   * @returns
   */
  toObject(): { _tag: "some"; value: T } | { _tag: "none" } {
    return this.isSome() ? { _tag: "some", value: this.unwrap() } : { _tag: "none" };
  }

  toString(options?: ToStringOptions): string {
    if (this.isSome()) {
      const stringifiedValue =
        options?.pretty === true ? JSON.stringify(this.unwrap(), null, 2) : JSON.stringify(this.unwrap());
      return `Some(${stringifiedValue})`;
    }
    return "None";
  }

  static getTag(): {
    _tag: _OptionTag;
  } {
    throw new Error("Method not implemented.");
  }

  /**
   * Unwraps the value from the Result, throwing an error if it's an Err
   *
   * When using `$get` operator, this may cause throw error, for safety, requires to use with `Std.func`.
   *
   * Inspired by Rust's `?` operator
   *
   * @ref https://doc.rust-lang.org/reference/expressions/operator-expr.html#the-question-mark-operator
   * @throws {None} if the `Option` is None
   */
  get $get(): T {
    if (this.isSome()) {
      return this.unwrap();
    }
    throw none;
  }
}

export class Some<T> extends OptionBase<T> {
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

export class None<T = never> extends OptionBase<T> {
  protected readonly _tag = "none";

  static getTag(): { _tag: "none" } {
    return { _tag: "none" };
  }
}

// ------------ Helper functions ------------

export function some<T>(value: T): Some<T> {
  return new Some(value);
}
export const none: None = new None();
export const _Some = Some.getTag();
export const _None = None.getTag();
