import { err, ok, type Result } from "./result";

async function from<T>(promise: Promise<T>): Promise<Result<T, Error>> {
  try {
    return ok(await promise);
  } catch (e) {
    if (e instanceof Error) {
      return err(e);
    }
    return err(new Error(String(e)));
  }
}

async function all<T>(promises: Promise<T>[]) {}

export const promise = {
  from,
  all,
};
