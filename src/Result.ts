import type { Equal, Expect } from "@type-challenges/utils";
import type { StdError } from "./Std.js";
import { getClassName } from "./StdObject.js";
import type {
  Composable,
  ExcludeNeverKey,
  Matchable,
  PromiseLike,
  Tagged,
  ToStringOptions,
  Transformable,
  Unwrapable
} from "./types.js";
import { isPromise } from "./Utils.js";

/**
 * Rust inspired Result type for TypeScript
 * @ref https://dev.to/alexanderop/robust-error-handling-in-typescript-a-journey-from-naive-to-rust-inspired-solutions-1mdh
 */
type ExtractOk<T> = T extends Ok<infer U> ? U : never;
type ExtractErr<T> = T extends Err<infer U> ? U : never;
// type MergeResultUnion<T> = Result<ExtractOk<T>, ExtractErr<T>> ไม่ต้องทำผ่าน Type แต่ทำที่ Return Type แทน

export type Result<T, E> = Ok<T> | Err<E>;
export type _ResultTag = "success" | "failure";
export type AcceptableError = unknown | { _tag: string };

export type ExtractErrorKind<E extends AcceptableError> = E extends {
  _tag: infer Kind;
} ? StdError<Kind>
  : E;

export type ExtractErrorKindForMatching<E extends AcceptableError> = E extends {
  _tag: infer Kind;
} ? { _tag: Kind }
  : E;

export type ExtractErrorKindKeyForMatching<E extends AcceptableError> = E extends {
  _tag: infer Kind;
} ? Kind
  : E;

type cases = [
  Expect<Equal<ExtractErrorKindKeyForMatching<"efef" | "xxx">, "efef" | "xxx">>,
  Expect<Equal<ExtractErrorKindKeyForMatching<{ _tag: "efef" | "xxx" }>, "efef" | "xxx">>,
  Expect<Equal<ExtractErrorKindForMatching<{ _tag: "efef" | "xxx" }>, { _tag: "efef" | "xxx" }>>,
  Expect<Equal<ExtractErrorKindForMatching<StdError<"aaa" | "bbb">>, { _tag: "aaa" | "bbb" }>>
];

/**
 * Ok Result for pattern matching
 */
export type ResultOk<T = undefined> = T extends undefined ? {
    _tag: "success";
  }
  : {
    _tag: "success";
    value: T;
  };

class EnsureError<E> {
  public error!: E;

  /**
   * Err Result with _tag for pattern matching
   *
   * Maintainer Note: When call this method from Err or Ok, the _tag type will correctly infer,
   * but when call from ResultBase, it will infer as never.
   *
   * @param _tag
   * @returns
   */
  tag<TKind extends ExcludeNeverKey<ExtractErrorKindKeyForMatching<E>, "error">>(
    _tag: TKind
  ): { _tag: "failure"; error: { _tag: TKind } } {
    return { _tag: "failure", error: { _tag } };
  }
}

export class ResultBase<T, E extends AcceptableError>
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
   * Ensure the Result doesn't have an `never` type, this is useful for type inference
   * @returns
   */
  get errWith(): ExcludeNeverKey<EnsureError<E>, "error"> {
    return new EnsureError() as ExcludeNeverKey<EnsureError<E>, "error">;
  }

  extract(): {
    result: Result<T, E>;
    ok: ExcludeNeverKey<Ok<T>, "value">;
    err: ExcludeNeverKey<Err<ExtractErrorKindKeyForMatching<E>>, "error">;
  } {
    return {
      result: this as unknown as Result<T, E>,
      ok: this as unknown as ExcludeNeverKey<Ok<T>, "value">,
      err: this as unknown as ExcludeNeverKey<Err<ExtractErrorKindKeyForMatching<E>>, "error">
    };
  }

  /**
   * Ok Result for pattern matching
   */
  ok(): { _tag: "success" } {
    return { _tag: "success" };
  }
  /**
   * Err Result for pattern matching
   */
  err(): { _tag: "failure" } {
    return { _tag: "failure" };
  }

  toString(options?: ToStringOptions): string {
    if (this.isOk()) {
      const stringifiedValue = options?.pretty === true
        ? JSON.stringify(this.unwrap(), null, 2)
        : JSON.stringify(this.unwrap());
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
   * When using `unwrapOrThrow()` operator, this may cause throw error, for safety, requires to use with `Result.func`.
   *
   * Inspired by Rust's `?` operator
   *
   * @ref https://doc.rust-lang.org/reference/expressions/operator-expr.html#the-question-mark-operator
   * @throws {Err} if the `Result` is Err
   */
  unwrapOrThrow(): T {
    if (this.isOk()) {
      return this.unwrap();
    }
    if (this.isErr()) {
      throw this.unwrap();
    }
    throw new Error("Unknown Result type");
  }
}

export class Ok<T> extends ResultBase<T, never> implements Unwrapable<T> {
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

export class Err<E extends unknown | { _tag: TErrorKind }, TErrorKind = string> extends ResultBase<never, E>
  implements Unwrapable<E>
{
  readonly _tag = "failure";
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
// export const _Ok = Ok.getTag();
// export const _Err = Err.getTag();

// -----------------------------------------
// |                                       |
// |       Create Functions Helper         |
// |                                       |
// -----------------------------------------

export type ResultContext<T, E> = {
  ok: (value: T) => Ok<T>;
  err: (value: E) => Err<E>;
};

/**
 * Sync Function - The building block for creating a Result object from a function,
 * it is used to catch errors and return a Result object.
 */
export const func = <T, E>(
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

export const funcAsync = async <T, E, A extends Result<T, E>>(
  fn: () => Promise<A>
): Promise<Result<ExtractOk<A>, ExtractErr<A>>> => {
  try {
    return await fn() as Result<ExtractOk<A>, ExtractErr<A>>;
  } catch (e) {
    return err(e as E) as Result<ExtractOk<A>, ExtractErr<A>>;
  }
};

/**
 * Promise Wrapper for Result Object, the building block for creating a Result object from a promise,
 * Support try block and try-catch block.
 *
 * Look like `Result.funcAsync`, but accept promise object or function that returns a Promise.
 *
 * @example
 *
 * ```ts
 * await Result.promise({
 *   try: () => Std.delay(1000),
 *   catch: (error) => `Custom Error: ${error}`,
 * })
 * ```
 *
 * @param tryOrTryCatch An object with try and catch function
 * @returns
 */

export async function promise<T, E>(tryOrTryCatch: {
  try: () => PromiseLike<T>;
  catch: (error: unknown) => E;
}): Promise<Result<T, E>>;

/**
 * Promise Wrapper for Result Object, the building block for creating a Result object from a promise,
 * Support try block and try-catch block.
 *
 * Look like `Result.funcAsync`, but accept promise object or function that returns a Promise.
 *
 * @example
 *
 * ```ts
 * await Result.promise(() => Std.delay(1000))
 * ```
 *
 * @param tryOrTryCatch The function that returns a Promise
 * @returns
 */

export async function promise<T, E>(tryOrTryCatch: () => PromiseLike<T>): Promise<Result<T, E>>;

/**
 * Promise Wrapper for Result Object, the building block for creating a Result object from a promise,
 * Support try block and try-catch block.
 *
 * Look like `Result.funcAsync`, but accept promise object or function that returns a Promise.
 *
 * @example
 *
 * ```ts
 * await Result.promise(Std.delay(1000))
 * ```
 *
 * @param tryOrTryCatch a Promise object
 * @returns
 */

export async function promise<T, E>(tryOrTryCatch: PromiseLike<T>): Promise<Result<T, E>>;

export async function promise<T, E>(tryOrTryCatch: unknown): Promise<Result<T, E>> {
  let isTryCatch = false;
  let tryFn: () => PromiseLike<T>;
  let catchFn: (error: unknown) => E = () => ({} as E);
  if (typeof tryOrTryCatch === "function") {
    tryFn = tryOrTryCatch as () => PromiseLike<T>;
  } else if (isPromise(tryOrTryCatch)) {
    tryFn = () => tryOrTryCatch as PromiseLike<T>;
  } else {
    isTryCatch = true;
    tryFn = (tryOrTryCatch as { try: () => PromiseLike<T> }).try;
    catchFn = (tryOrTryCatch as { catch: (error: unknown) => E }).catch;
  }
  try {
    return ok(await tryFn()) as Result<T, E>;
  } catch (e) {
    return err(isTryCatch ? catchFn(e) : (e as E));
  }
}
