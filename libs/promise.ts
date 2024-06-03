import { err, ok, type Result } from "./result";

export async function fromPromise<T>(
  promise: Promise<T>
): Promise<Result<T, string>> {
  try {
    return ok(await promise);
  } catch (e) {
    if (e instanceof Error) {
      return err(e.message);
    }
    return err(String(e));
  }
}
