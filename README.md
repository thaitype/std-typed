# Standard Typed

Experimental Implementation of the standard library for the TypeScript, inspired by Rust's standard library. 

## Introduction
Every piece of code should be type-safe and error handling should be explicit. 
`Result` and `Option` concept from Rust is a good way to handle error and data in a type-safe way.
`Promise` is one of the most common way to handle async operation, however, it's not type-safe and error handling is not explicit.
So, each function in `std-types` should return `Result` or `Option` type, instead of throwing an error, and support `Promise` as well.

## Getting Started

The example below demonstrates how to deal with Promise and error handling from `fetch` function

Instead of throwing an error and nested try-catch block, and unable to handle error type.

```ts
async function unsafeFetch(url: string) {
  try {
    const result = await fetch(url);
    if (!result.ok) throw new Error("FetchError");

    try {
      const json = await result.json();
      return json;
    } catch (e) {
      throw new Error("InvalidJsonError");
    }
  } catch (e) {
    throw new Error("RequestFailError");
  }
}
```

Using `std-types` to handle error and data in a type-safe way.

```ts
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
```

After that you can handle the error and data in a type-safe way using pattern maching approach. 
The example below demonstrates how to handle various error type using `match` function from `ts-pattern`.

```ts
Std.runExit(async () => {
  const prefixUrl = "https://jsonplaceholder.typicode.com";
  console.log(`Fetching Prefix url: "${prefixUrl}"...\n`);
  for (const url of [
    `${prefixUrl}/todos/1`, // Fetch Result
    `${prefixUrl}xx/todos/1`, // RequestFailError
    `${prefixUrl}/todos/-2`, // FetchError
    `${prefixUrl}/todos/1?variant=invalidJson`, // InvalidJsonError
  ]) {
    const result = await safeFetch(url);
    const cleanedUrl = url.replace(prefixUrl, "");
    match(result.into())
      .with(result.ok(), value => console.log(`Fetch Result (url="${cleanedUrl}"): => ${JSON.stringify(value.value)}`))
      .with(result.errWith.kind("FetchError"), error => console.error(`Failed to fetch (url="${cleanedUrl}"): => ${error.error}`))
      .with(result.errWith.kind("InvalidJsonError"), error => console.error(`Invalid JSON (url="${cleanedUrl}"): => ${error.error}`))
      .with(result.errWith.kind("RequestFailError"), error => console.error(`Request failed (url="${cleanedUrl}"): => ${error.error}`))
      .exhaustive();
  }
});
```

The output will be:

```
Fetching Prefix url: "https://jsonplaceholder.typicode.com"...

Fetch Result (url="/todos/1"): => {"userId":1,"id":1,"title":"delectus aut autem","completed":false}
Request failed (url="xx/todos/1"): => StdError(RequestFailError): FailedToOpenSocket: Was there a typo in the url or port?
Failed to fetch (url="/todos/-2"): => StdError(FetchError): Error: Something went wrong
Invalid JSON (url="/todos/1?variant=invalidJson"): => StdError(InvalidJsonError): Error: Invalid JSON
```

Note: The `Std.runExit` is a helper function to run the async function and handle the error, you can you outside of the function as well.

The getting started example demonstrates how to handle error and data in a type-safe way using `std-types` and `ts-pattern`.
You can see the full example in the [examples/fetch-02-without-try-catch.ts](./examples/fetch-02-without-try-catch.ts) file.

## Examples

For more practical examples, please see the [examples](./examples) folder.

## Project Philosophy

- **Never Throw**: The standard library should never throw an error, using `Result` type for data and error handling, inspired by Rust.
- **Standard Library**: The standard library should be a collection of useful data structures and functions that are commonly used in everyday programming.
- **Type Safety**: The standard library should be type-safe.
- **Performance**: The standard library should be performant.
- **Error Handling**: The standard library should provide a way to handle errors.

## What's excluded? 
- No Functional Programming (FP) concepts, please use [Effect](https://effect.website/) for that.
- Complex scenarios using consider using [Effect](https://effect.website/).

## Installation

```bash
npm install std-types
```

## Considerations
- Implementing custom function ported from Rust using `napi` for performance.
  - However, this may cause issue with the performance, if's applied in the wrong way.
  - However, this may cause issue with Bundling, so, this, library should provided mimimal version e.g. `@std-types/minimal` 



