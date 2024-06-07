import type { Composable, Matchable, Tagged, ToStringOptions, Transformable, Unwrapable } from "./types.js";
// import type { ExtractErrorKind, ExtractErrorKindForMatching, ExtractErrorKindKeyForMatching } from "./Std.js";
import { getClassName } from "./Object.js";
import type { TypedError } from "./Std.js";

export type AcceptedError = { kind: string };

export type ExtractErrorKind<E extends AcceptedError> = E extends {
  kind: infer Kind;
}
  ? TypedError<Kind>
  : E;

export type ExtractErrorKindForMatching<E extends AcceptedError> = E extends {
  kind: infer Kind;
}
  ? { kind: Kind }
  : E;

export type ExtractErrorKindKeyForMatching<E extends AcceptedError> = E extends {
  kind: infer Kind;
}
  ? Kind
  : E;

  type test = ExtractErrorKindKeyForMatching<'efef' | 'xxx'>;
       // ^?
  type test2 = ExtractErrorKindKeyForMatching<{ kind: 'efef' | 'xxx' }>;
       // ^?
  
  type test3 = ExtractErrorKindForMatching<{ kind: 'efef' | 'xxx' }>;
      // ^?
  type test4 = ExtractErrorKindForMatching<TypedError<'aaa' | 'bbb'>>;
      // ^?


/**
 * Rust inspired Result type for TypeScript
 * @ref https://dev.to/alexanderop/robust-error-handling-in-typescript-a-journey-from-naive-to-rust-inspired-solutions-1mdh
 */
export type Result<T, E extends AcceptedError> = Ok<T> | Err<E>;
export type _ResultTag = "success" | "failure";

/**
 * Ok Result for pattern matching
 */
export type ResultOk<T = undefined> = T extends undefined
  ? {
      _tag: "success";
    }
  : {
      _tag: "success";
      value: T;
    };

type TestType = ResultOk;
// ^?

export class ResultBase<T, E extends AcceptedError>
  implements Tagged<_ResultTag>, Transformable, Composable<T>, Matchable
{
  public value!: T;
  public error!: E;
  readonly _tag: _ResultTag = "success";

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
  match<U, V>(pattern: {
    /** When the Result is Ok, it will call the `ok` function with the value */
    ok: (value: T) => U;
    /** When the Result is Err, it will call the `err` function with the error */
    err: (error: E) => V;
  }): U | V {
    return this.isOk() ? pattern.ok(this.value) : pattern.err(this.error);
  }

  /**
   * Converts the Result to an object for type-safe pattern matching
   * @returns
   */
  into(): { _tag: "success"; value: T } | { _tag: "failure"; error: ExtractErrorKind<E> } {
    return this.isOk()
      ? { _tag: "success", value: this.value }
      : { _tag: "failure", error: this.error as ExtractErrorKind<E> };
  }



  /**
   * Ok Result for pattern matching
   */
  ok(): { _tag: "success" } {
    return { _tag: "success" };
  }
  /**
   * Ok Result for pattern matching
   */
  // okWithValue<TFilter extends T>(value?: TFilter): ResultOk<TFilter> {
  //   if (value === undefined) {
  //     return { _tag: "success" } as ResultOk<TFilter>;
  //   }
  //   return { _tag: "success", value: this.value } as unknown as ResultOk<TFilter>;
  // }
  err(): { _tag: "failure" } {
    return { _tag: "failure" };
  }

  /**
   * Note: When call this method from Err or Ok, the kind type will correctly infer,
   * but when call from ResultBase, it will infer as never.
   *
   * @param kind
   * @returns
   */
  errWith(
    kind: ExtractErrorKindKeyForMatching<E>
  ): { _tag: "success"; value: T } | { _tag: "failure"; error: ExtractErrorKind<E> } {
    return { _tag: "failure", error: this.error as unknown as ExtractErrorKindForMatching<E> } as any;
  }

  toString(options?: ToStringOptions): string {
    if (this.isOk()) {
      const stringifiedValue =
        options?.pretty === true ? JSON.stringify(this.unwrap(), null, 2) : JSON.stringify(this.unwrap());
      return `Ok(${stringifiedValue})`;
    }
    if (this.isErr()) {
      const value = this.unwrap();
      let stringifiedValue = options?.pretty === true ? JSON.stringify(value, null, 2) : JSON.stringify(value);
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
   * When using `$get` operator, this may cause throw error, for safety, requires to use with `Result.func`.
   *
   * Inspired by Rust's `?` operator
   *
   * @ref https://doc.rust-lang.org/reference/expressions/operator-expr.html#the-question-mark-operator
   * @throws {Err} if the `Result` is Err
   */
  get $get(): T {
    if (this.isOk()) {
      return this.unwrap();
    }
    if (this.isErr()) {
      throw this.unwrap();
    }
    throw new Error("Unknown Result type");
  }
}

export class Ok<T> extends ResultBase<T, AcceptedError> implements Unwrapable<T> {
  readonly _tag = "success";
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

export class Err<E extends AcceptedError> extends ResultBase<never, E> implements Unwrapable<E> {
  readonly _tag = "failure";
  constructor(public error: E) {
    super();
  }

  unwrap(): E {
    return this.error;
  }

  extract(): {
    result: Result<any, E>;
    ok: Ok<any>;
    err: Err<E>;
  } {
    return {
      result: this as unknown as Result<any, E>,
      ok: this as unknown as Ok<any>,
      err: this as unknown as Err<E>,
    };
  }

  static getTag(): { _tag: "failure" } {
    return { _tag: "failure" };
  }
}

// -------- Helper functions --------
export function ok<T>(value: T): Ok<T> {
  return new Ok(value);
}
export function err<const E extends AcceptedError>(error: E): Err<E> {
  return new Err(error);
}
export const _Ok = Ok.getTag();
export const _Err = Err.getTag();

// -------- Create Functions Helper --------

export type ResultContext<T, E extends AcceptedError> = {
  ok: (value: T) => Ok<T>;
  err: (value: E) => Err<E>;
};

/**
 * Sync Function - The building block for creating a Result object from a function,
 * it is used to catch errors and return a Result object.
 */
export const func = <T, E extends AcceptedError>(
  /** Passing result context */
  fn: (context: ResultContext<T, E>) => Result<T, E>
): Result<T, E> => {
  try {
    return fn({ ok, err });
  } catch (e) {
    return err(e as E);
  }
};

/**
 * Async Function - The building block for creating a Result object from an async function,
 * it is used to catch errors and return a Result object.
 *
 * @param fn Expecting a function that returns a Promise
 * @returns Promise of Result Object
 */

export const funcAsync = async <T, E extends AcceptedError>(
  /** Passing result context */
  fn: (context: ResultContext<T, E>) => Promise<Result<T, E>>
): Promise<Result<T, E>> => {
  try {
    return await fn({ ok, err });
  } catch (e) {
    return err(e as E);
  }
};
