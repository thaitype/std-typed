import * as Result from "./result";
import { isPromise } from "./helpers/predicate";
import { type PromiseLike } from "./types";

/**
 * Run Sync/Async
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

const try_ = <T>(fn: () => Result.Result<T, any>): Result.Result<T, any> => {
  try {
    return fn() as Result.Result<T, any>;
  } catch (e) {
    return Result.err(e);
  }
};

export {
  /**
   * The operation might throw an error
   *
   * @ref Effect.try
   */
  try_ as try,
};
