import { err, ok, type Result } from "./result";
import { isPromise } from "./predicate";

export type PromiseLike<T> = T | Promise<T>;

export interface ToStringOptions {
  pretty?: boolean;
}

/**
 * Run Sync/Async
 */
export async function run<T>(result: () => PromiseLike<T>): Promise<Result<T, Error>> {
  try {
    return ok(await runExit(result));
  } catch (e) {
    if (e instanceof Error) {
      return err(e);
    }
    return err(new Error(String(e)));
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

const try_ = <T>(fn: () => Result<T, any>): Result<T, any> => {
  try {
    return fn() as Result<T, any>;
  } catch (e) {
    return err(e);
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

// -------------- Pipe Function --------------

type AnyFunc = (...arg: any) => any;

type LastFnReturnType<F extends Array<AnyFunc>, Else = never> = F extends [...any[], (...arg: any) => infer R]
  ? R
  : Else;

type PipeArgs<F extends AnyFunc[], Acc extends AnyFunc[] = []> = F extends [(...args: infer A) => infer B]
  ? [...Acc, (...args: A) => B]
  : F extends [(...args: infer A) => any, ...infer Tail]
  ? Tail extends [(arg: infer B) => any, ...any[]]
    ? PipeArgs<Tail, [...Acc, (...args: A) => B]>
    : Acc
  : Acc;

/**
 * Pipe a value through a sequence of functions
 *
 * @ref https://dev.to/ecyrbe/how-to-use-advanced-typescript-to-define-a-pipe-function-381h
 */
export function pipe<FirstFn extends AnyFunc, F extends AnyFunc[]>(
  arg: Parameters<FirstFn>[0],
  firstFn: FirstFn,
  ...fns: PipeArgs<F> extends F ? F : PipeArgs<F>
): LastFnReturnType<F, ReturnType<FirstFn>> {
  return (fns as AnyFunc[]).reduce((acc, fn) => fn(acc), firstFn(arg));
}


// --------------------------------