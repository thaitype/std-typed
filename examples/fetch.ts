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

    // @ts-expect-error
    result.errWith('FetchError')
    
    match(result.into())
      .with(result.ok(), value =>
        console.log(
          `Fetch Result (id="${id}"): => ${JSON.stringify(value.value)}`
        )
      )
      .with({ _tag: "failure", error: { kind: 'FetchError'} } , error => console.error(`Failed to fetch (id="${id}"): => ${error.error}`))
      .with({ _tag: "failure", error: { kind: 'InvalidJsonError'} } , error => console.error(`Invalid JSON (id="${id}"): => ${error.error}`))
      .with({ _tag: "failure", error: { kind: 'RequestFailError'} } , error => console.error(`Request failed (id="${id}"): => ${error.error}`))
      .exhaustive();
  }
});
