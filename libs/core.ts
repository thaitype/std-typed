import { err, ok, type Result } from "./result";
import { isPromise } from "./predicate";

export type PromiseLike<T> = T | Promise<T>;

export interface ToStringOptions {
  pretty?: boolean;
}

/**
 * Run Sync/Async
 */
export async function run<T>(
  result: () => PromiseLike<T>
): Promise<Result<T, Error>> {
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
