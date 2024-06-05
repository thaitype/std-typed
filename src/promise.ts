import * as Result from "./result";

export async function from<T>(promise: Promise<T>): Promise<Result.Result<T, Error>> {
  try {
    return Result.ok(await promise);
  } catch (e) {
    if (e instanceof Error) {
      return Result.err(e);
    }
    return Result.err(new Error(String(e)));
  }
}

export async function all<T>(promises: Promise<T>[]) {}
