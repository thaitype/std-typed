import { Result, Std } from "std-typed";
import { match } from "ts-pattern";

/**
 * https://www.npmjs.com/package/p-retry
 * https://2024-effect-days-keynote.vercel.app/8
 * https://youtu.be/PxIBWjiv3og
 *
 * TODO: Unhandled throw Error, is missing
 */

class FetchError extends Std.TypedError<
  "FetchError" | "InvalidJsonError" | "RequestFailError"
> {}

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
      .with({ _tag: "failure", error: { kind: 'FetchError'} } , error => console.error(`Fetch Error (id="${id}"): => Failed to fetch ${error.error}`))
      .with({ _tag: "failure", error: { kind: 'InvalidJsonError'} } , error => console.error(`Fetch Error (id="${id}"): => Invalid JSON ${error.error}`))
      .with({ _tag: "failure", error: { kind: 'RequestFailError'} } , error => console.error(`Fetch Error (id="${id}"): => Request failed ${error.error}`))
      .exhaustive();
  }
});
