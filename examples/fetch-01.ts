import { Result, Std } from "std-typed";
import { match } from "ts-pattern";
import { mockParseJson } from "./fetch.js";

class FetchError extends Std.StdError<"FetchError" | "InvalidJsonError" | "RequestFailError"> {}

// async function unsafeFetch(url: string) {
//   try {
//     const result = await fetch(url);
//     if (!result.ok) throw new Error("FetchError");

//     try {
//       const json = await result.json();
//       return json;
//     } catch (e) {
//       throw new Error("InvalidJsonError");
//     }
//   } catch (e) {
//     throw new Error("RequestFailError");
//   }
// }

const safeFetch = (url: string) =>
  Result.funcAsync(async () => {
    try {
      const result = await fetch(url);
      if (!result.ok) return Result.err(new FetchError("FetchError"));

      try {
        const json = await mockParseJson(result, url);
        return Result.ok(json);
      } catch (e) {
        return Result.err(new FetchError("InvalidJsonError", e));
      }
    } catch (e) {
      return Result.err(new FetchError("RequestFailError", e));
    }
  });

Std.runExit(async () => {
  const prefixUrl = "https://jsonplaceholder.typicode.com";
  console.log(`Fetching Prefix url: "${prefixUrl}"...\n`);
  for (
    const url of [
      `${prefixUrl}/todos/1`, // Fetch Result
      `${prefixUrl}xx/todos/1`, // RequestFailError
      `${prefixUrl}/todos/-2`, // FetchError
      `${prefixUrl}/todos/1?variant=invalidJson` // InvalidJsonError
    ]
  ) {
    const result = await safeFetch(url);
    const cleanedUrl = url.replace(prefixUrl, "");
    match(result.into())
      .with(
        result.ok(),
        (value) => console.log(`Fetch Result (url="${cleanedUrl}"): => ${JSON.stringify(value.value)}`)
      )
      .with(
        result.errWith.tag("FetchError"),
        (error) => console.error(`Failed to fetch (url="${cleanedUrl}"): => ${error.error}`)
      )
      .with(
        result.errWith.tag("InvalidJsonError"),
        (error) => console.error(`Invalid JSON (url="${cleanedUrl}"): => ${error.error}`)
      )
      .with(
        result.errWith.tag("RequestFailError"),
        (error) => console.error(`Request failed (url="${cleanedUrl}"): => ${error.error}`)
      )
      .exhaustive();
  }
});
