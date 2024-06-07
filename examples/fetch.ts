import type { Err } from "src/Result.js";
import { Result, Std } from "std-typed";
import { match } from "ts-pattern";

/**
 * https://www.npmjs.com/package/p-retry
 * https://2024-effect-days-keynote.vercel.app/8
 * https://youtu.be/PxIBWjiv3og
 *
 * TODO: Unhandled throw Error, is missing
 */

// export class FetchError {
//   constructor(
//     public readonly kind: "FetchError" | "InvalidJsonError" | "RequestFailError"
//   ) {}
// }
class FetchError extends Error {
  constructor(
    public readonly kind:
      | "FetchError"
      | "InvalidJsonError"
      | "RequestFailError",
    error?: unknown
  ) {
    const message =
      error instanceof Error ? error.message : String(error ?? "");
    super(message);
    if (error instanceof Error) {
      this.stack = error.stack;
      this.cause = error.cause;
      this.name = error.name;
    }
  }
}

const getTodo = (id: number) =>
  Result.funcAsync<unknown, FetchError>(async c => {
    try {
      const result = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${id}`
      );
      if (!result.ok) return c.err(new FetchError("FetchError"));

      try {
        const json = await result.json();
        return c.ok(json);
      } catch (e) {
        return c.err(new FetchError("InvalidJsonError", e));
      }
    } catch (e) {
      return c.err(new FetchError("RequestFailError", e));
    }
  });

Std.runExit(async () => {
  for (const id of [-1, 1]) {
    const result = await getTodo(id);
    match(result.into())
      .with({ _tag: "success" }, value =>
        console.log(
          `Fetch Result (id="${id}"): => ${JSON.stringify(value.value)}`
        )
      )
      .with({ _tag: "failure"}, error =>
        console.error(`Fetch Error (id="${id}"): => ${error.error} ${error.error.kind}`)
      )
      .exhaustive();
  }
});
