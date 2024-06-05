import type { ToStringOptions } from "./types.js";
import { getClassName } from "./Object.js";

/**
 * Rust inspired Result type for TypeScript
 * @ref https://dev.to/alexanderop/robust-error-handling-in-typescript-a-journey-from-naive-to-rust-inspired-solutions-1mdh
 */
export type Result<T, E> = Ok<T> | Err<E>;
export type _ResultTag = "success" | "failure";

export class ResultBase<T, E> {
  public value!: T;
  public error!: E;
  protected readonly _tag: _ResultTag = "success";

  isOk(): this is Ok<T> {
    return this._tag === "success";
  }

  isErr(): this is Err<E> {
    return this._tag === "failure";
  }

  /**
   * Simple pattern matching for Result, for more complex matching use external libraries like `ts-pattern`
   * @param pattern
   * @returns
   */
  match<U>(pattern: { ok: (value: T) => U; err: (error: E) => U }): U {
    return this.isOk() ? pattern.ok(this.value) : pattern.err(this.error);
  }

  /**
   * Converts the Result to an object for type-safe pattern matching
   * @returns
   */
  toObject(): { _tag: "success"; value: T } | { _tag: "failure"; error: E } {
    return this.isOk()
      ? { _tag: "success", value: this.value }
      : { _tag: "failure", error: this.error };
  }

  toString(options?: ToStringOptions): string {
    if (this.isOk()) {
      const stringifiedValue =
        options?.pretty === true
          ? JSON.stringify(this.unwrap(), null, 2)
          : JSON.stringify(this.unwrap());
      return `Ok(${stringifiedValue})`;
    }
    if (this.isErr()) {
      const value = this.unwrap();
      let stringifiedValue =
        options?.pretty === true
          ? JSON.stringify(value, null, 2)
          : JSON.stringify(value);
      let className = "";
      const result = getClassName(value);
      if (result.isSome()) {
        className = result.unwrap() + " ";
      }
      if (value instanceof Error) {
        stringifiedValue = `${value.stack}`;
      }
      return `Err(${className}${stringifiedValue})`;
    }
    return "Unknown";
  }

  static getTag(): {
    _tag: _ResultTag;
  } {
    throw new Error("Method not implemented.");
  }

  /**
   * Unwraps the value from the Result, throwing an error if it's an Err
   * 
   * Using with `Std.try`.
   * 
   * @ref https://doc.rust-lang.org/reference/expressions/operator-expr.html#the-question-mark-operator
   * @throws {Err} if the `Result` is Err
   */
  get(): T {
    if (this.isOk()) {
      return this.unwrap();
    }
    if(this.isErr()) {
      throw this.unwrap();
    }
    throw new Error("Unknown Result type");
  }
}

export class Ok<T> extends ResultBase<T, never> {
  protected readonly _tag = "success";
  constructor(public value: T) {
    super();
  }

  unwrap(): T {
    return this.value;
  }

  static getTag(): { _tag: "success" } {
    return { _tag: "success" };
  }
}

export class Err<E> extends ResultBase<never, E> {
  protected readonly _tag = "failure";
  constructor(public error: E) {
    super();
  }

  unwrap(): E {
    return this.error;
  }

  static getTag(): { _tag: "failure" } {
    return { _tag: "failure" };
  }
}

// -------- Helper functions --------
export function ok<T>(value: T): Ok<T> {
  return new Ok(value);
}
export function err<const E>(error: E): Err<E> {
  return new Err(error);
}
export const _Ok = Ok.getTag();
export const _Err = Err.getTag();
