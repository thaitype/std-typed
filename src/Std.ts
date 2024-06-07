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

export type ResultContext<T, E> = {
  ok: (value: T) => Result.Ok<T>;
  err: (value: E) => Result.Err<E>;
};

/**
 * Sync Function - The building block for creating a Result object from a function,
 * it is used to catch errors and return a Result object.
 */
export const func = <T, E>(
  /** Passing result context */
  fn: (context: ResultContext<T, E>) => Result.Result<T, E>
): Result.Result<T, E> => {
  try {
    return fn({
      ok: Result.ok,
      err: Result.err,
    });
  } catch (e) {
    return Result.err(e as E);
  }
};

/**
 * Async Function - The building block for creating a Result object from an async function,
 * it is used to catch errors and return a Result object.
 *
 * @param fn Expecting a function that returns a Promise
 * @returns Promise of Result Object
 */

export const funcAsync = async <T, E>(
  /** Passing result context */
  fn: (context: ResultContext<T, E>) => Promise<Result.Result<T, E>>
): Promise<Result.Result<T, E>> => {
  try {
    return (await fn({
      ok: Result.ok,
      err: Result.err,
    })) as Result.Result<T, any>;
  } catch (e) {
    return Result.err(e as E);
  }
};

/**
 * Delay for a specified amount of time
 * @param ms value in milliseconds
 * @returns Promise of void
 */
export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
