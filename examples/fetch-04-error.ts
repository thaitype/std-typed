import { Result, Std } from "std-typed";
import { match } from "ts-pattern";
import { mockParseJson } from "./fetch.js";

// class FetchError extends Std.StdError<"FetchError" | "InvalidJsonError" | "RequestFailError"> {}

class FetchError {
  readonly _tag = "FetchError";
}

class RequestFailError {
  readonly _tag = "RequestFailError";
}

class InvalidJsonError {
  readonly _tag = "InvalidJsonError";
}

const safeFetch = async (url: string) =>
  Result.funcAsync(async () => {
    const result = await Result.promise(fetch(url));
    if (result.isErr()) return Result.err(new RequestFailError());

    const response = result.unwrap();
    if (!response.ok) return Result.err(new FetchError());

    const json = await Result.promise(mockParseJson(response, url));
    if (json.isErr()) return Result.err(new InvalidJsonError());

    return Result.ok(json.unwrap());
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
        { _tag: "success" },
        ({ value }) => console.log(`Fetch Result (url="${cleanedUrl}"): => ${JSON.stringify(value)}`)
      )
      .with(
        { _tag: "failure", error: { _tag: "FetchError" } },
        (error) => console.error(`Failed to fetch (url="${cleanedUrl}"): => FetchError ${error.error.stack}`)
      )
      .with(
        { _tag: "failure", error: { _tag: "InvalidJsonError" } },
        (error) => console.error(`Invalid JSON (url="${cleanedUrl}"): => InvalidJsonError ${error.error.stack}`)
      )
      .with(
        { _tag: "failure", error: { _tag: "RequestFailError" } },
        (error) => console.error(`Request failed (url="${cleanedUrl}"): => RequestFailError ${error.error.stack}`)
      )
      .exhaustive();
  }
});
