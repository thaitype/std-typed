import { err, ok } from "./result";

export const fromPromise = async <T>(promise: Promise<T>) => {
  try {
    return ok(await promise);
  } catch (e) {
    if (e instanceof Error) {
      return err(e.message);
    }
    return err(String(e));
  }
};
