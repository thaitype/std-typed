import type { ToStringOptions } from "./core";

/**
 * Rust inspired Result type for TypeScript
 * @ref https://dev.to/alexanderop/robust-error-handling-in-typescript-a-journey-from-naive-to-rust-inspired-solutions-1mdh
 */
export type Result<T, E> = _Ok<T> | _Err<E>;
export type _ResultTag = "success" | "failure";

export class ResultBase<T, E> {
  public value!: T;
  public error!: E;
  protected readonly _tag: _ResultTag = "success";

  isOk(): this is _Ok<T> {
    return this._tag === "success";
  }

  isErr(): this is _Err<E> {
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
      if(value instanceof Error) {
        stringifiedValue = `${value.stack}`;
      }
      return `Err(${stringifiedValue})`;
    }
    return "Unknown";
  }

  static getTag(): {
    _tag: _ResultTag;
  } {
    throw new Error("Method not implemented.");
  }
}

export class _Ok<T> extends ResultBase<T, never> {
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

export class _Err<E> extends ResultBase<never, E> {
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
export function ok<T>(value: T): _Ok<T> {
  return new _Ok(value);
}
export function err<E>(error: E): _Err<E> {
  return new _Err(error);
}
export const Ok = _Ok.getTag();
export const Err = _Err.getTag();
