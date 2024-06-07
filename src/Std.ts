import * as Result from "./Result.js";
import { isPromise } from "./internal/predicate.js";
import { type PromiseLike } from "./types.js";

/**
 * Run Sync/Async without throwing an error
 */
export async function run<T>(result: () => PromiseLike<T>): Promise<Result.Result<T, Error>> {
  try {
    return Result.ok(await runExit(result));
  } catch (e) {
    if (e instanceof Error) {
      return Result.err(e);
    }
    return Result.err(new Error(String(e)));
  }
}

/**
 * Run Sync Function without throwing an error
 * @param result
 * @returns
 */
export function runSync<T>(result: () => T): Result.Result<T, Error> {
  try {
    return Result.ok(runSyncExit(result));
  } catch (e) {
    if (e instanceof Error) {
      return Result.err(e);
    }
    return Result.err(new Error(String(e)));
  }
}

/**
 * Run Sync/Async when throwing an error, exit the process
 */
export async function runExit<T>(fn: () => PromiseLike<T>): Promise<T> {
  const result = await fn();
  if (isPromise(result)) {
    return await result;
  } else {
    return result;
  }
}

/**
 * Run Sync Function when throwing an error, exit the process
 */
export function runSyncExit<T>(fn: () => T): T {
  return fn();
}

/**
 * Generate a Result object from a generator
 * @param fn
 * @returns
 */
// export function gen<T, E, R>(
//   fn: () => Generator<Result<T, E>, R>
// ): Result<T, E> {
//   let count = 0;
//   let result: Result<T, E> = err(new Error("No value") as E);

//   for (const val of fn()) {
//     // Return the first value
//     if (count === 0) result = val;
//     count++;
//     // Break if there are more than one value
//     if (count >= 2) {
//       break;
//     }
//   }
//   if (count >= 2) {
//     return err(new Error("The generator has more than one value") as E);
//   }
//   return result;
// }

/**
 * Delay for a specified amount of time
 * @param ms value in milliseconds
 * @returns Promise of void
 */
export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

/**
 * Error Base Class for discriminated union for `kind` field
 */
export class TypedError<Kind = string> extends Error {
  constructor(public readonly kind: Kind, error?: unknown) {
    super(error instanceof Error ? error.message : String(error ?? "Something went wrong"));
    if (error instanceof Error) {
      this.stack = error.stack;
      this.cause = error.cause;
      this.name = error.name;
    }
  }

  toString(): string {
    return `TypedError(${this.kind}): ${this.name}: ${this.message}`;
  }

  toJSON() {
    return {
      kind: this.kind,
      name: this.name,
      message: this.message,
      stack: this.stack,
      cause: this.cause,
    };
  }

  into() {
    return this.toJSON();
  }
}

export type ExtractErrorKind<E extends unknown | { kind: TErrorKind }, TErrorKind = string> = E extends {
  kind: infer Kind;
}
  ? TypedError<Kind>
  : E;
