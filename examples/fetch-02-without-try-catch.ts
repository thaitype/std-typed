import { Result, Std } from "std-typed";
import { match } from "ts-pattern";
import { mockParseJson } from "./fetch.js";

class FetchError extends Std.TypedError<"FetchError" | "InvalidJsonError" | "RequestFailError"> {}

const safeFetch = (url: string) =>
  Result.funcAsync<unknown, FetchError>(async c => {

    const result = await Result.promise(() => fetch(url))
    if(result.isErr()) return c.err(new FetchError("RequestFailError", result.unwrap()));
    
    const response = result.unwrap();
    if(!response.ok) return c.err(new FetchError("FetchError"));

    const json = await Result.promise(() => mockParseJson(response, url));
    if(json.isErr()) return c.err(new FetchError("InvalidJsonError", json.unwrap()));

    return c.ok(json.unwrap());

  });

Std.runExit(async () => {
  const prefixUrl = 'https://jsonplaceholder.typicode.com';
  console.log(`Fetching Prefix url: "${prefixUrl}"...\n`);
  for (const url of [
    `${prefixUrl}/todos/1`, // Fetch Result
    `${prefixUrl}xx/todos/1`, // RequestFailError
    `${prefixUrl}/todos/-2`, // FetchError
    `${prefixUrl}/todos/1?variant=invalidJson`, // InvalidJsonError
  ]) {
    const result = await safeFetch(url);
    const cleanedUrl = url.replace(prefixUrl, '')
    match(result.into())
      .with(result.ok(), value => console.log(`Fetch Result (url="${cleanedUrl}"): => ${JSON.stringify(value.value)}`))
      .with(result.errWith.kind("FetchError"), error => console.error(`Failed to fetch (url="${cleanedUrl}"): => ${error.error}`))
      .with(result.errWith.kind("InvalidJsonError"), error => console.error(`Invalid JSON (url="${cleanedUrl}"): => ${error.error}`))
      .with(result.errWith.kind("RequestFailError"), error => console.error(`Request failed (url="${cleanedUrl}"): => ${error.error}`))
      .exhaustive();
  }
});
