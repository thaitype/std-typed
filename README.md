# Standard Typed

[![npm version](https://img.shields.io/npm/v/std-typed)](https://www.npmjs.com/package/std-typed)

Experimental Implementation of the standard library for the TypeScript, inspired by Rust's standard library. 

## Introduction
Every piece of code should be type-safe and error handling should be explicit. The `Result` and `Option` concepts from Rust provide a robust way to handle errors and data in a type-safe manner. While `Promise` is a common way to handle async operations, it lacks type safety and explicit error handling. Therefore, each function in `std-types` returns a `Result` or `Option` type instead of throwing errors, and also supports `Promise`.

## Installation

```bash
npm install std-types
```

## Getting Started

The example below demonstrates how to handle Promises and errors using the `fetch` function.

Instead of throwing errors and using nested try-catch blocks, which make error types hard to handle:

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
import { Result, Std } from "std-typed";
import { mockParseJson } from "./fetch.js"; // Mocking Response.json() for testing

class FetchError extends Std.StdError<"FetchError" | "InvalidJsonError" | "RequestFailError"> {}

const safeFetch = (url: string) =>
  Result.funcAsync<unknown, FetchError>(async c => {

    const result = await Result.promise(fetch(url))
    if(result.isErr()) return c.err(new FetchError("RequestFailError", result.unwrap()));
    
    const response = result.unwrap();
    if(!response.ok) return c.err(new FetchError("FetchError"));

    const json = await Result.promise(mockParseJson(response, url));
    if(json.isErr()) return c.err(new FetchError("InvalidJsonError", json.unwrap()));

    return c.ok(json.unwrap());

  });
```

You can then handle the error and data in a type-safe way using a pattern matching approach. The example below demonstrates how to handle various error types using the match function from [ts-pattern](https://github.com/gvergnaud/ts-pattern).

```ts
import { Std } from "std-typed";
import { match } from "ts-pattern";

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

Note: The `Std.runExit` is a helper function to run the async function and handle errors. You can use it outside of the function as well.

The getting started example demonstrates how to handle errors and data in a type-safe way using `std-types` and `ts-pattern`. You can see the full example in the [examples/fetch-02-without-try-catch.ts](examples/fetch-02-without-try-catch.ts) file.

## Examples

For more practical examples, please see the [examples](examples) folder.

## Project Philosophy

- **Never Throw**: The standard library should never throw an error, using the `Result` type for data and error handling, inspired by Rust.
- **Standard Library**: The standard library should be a collection of useful data structures and functions that are commonly used in everyday programming.
- **Type Safety**: The standard library should be type-safe.
- **Performance**: The standard library should be performant.
- **Error Handling**: The standard library should provide a way to handle errors.

## What's excluded? 
- No Functional Programming (FP) concepts, please use [Effect](https://effect.website/) for that.
- Complex scenarios using consider using [Effect](https://effect.website/).

## Alternatives
[neverthrow](https://github.com/supermacro/neverthrow), [ts-results](https://github.com/vultix/ts-results), [Effect](https://github.com/Effect-TS/effect) and [fp-ts](https://github.com/gcanti/fp-ts) are implemented Rust's Option/Result concept.

## Q&A

### There are already `Result` and `Option` in `fp-ts` or `Effect`, why do we need another one?

[fp-ts](https://github.com/gcanti/fp-ts) and [Effect](https://github.com/Effect-TS/effect) are great libraries designed for functional programming. However, some functions do not provide better APIs for type-safe error handling like Rust's `Result` and `Option`. This project is heavily inspired by Rust's `Result` and `Option`, where every function should return a `Result` or `Option` type instead of throwing an error.

The main role of `std-types` is to provide a standard library for TypeScript that is type-safe and handles errors explicitly, rather than providing a functional programming library or complex scenarios like Effect. However, I've designed this library to be compatible with `fp-ts` and `Effect` as well. Due to its Promise-based approach, it's easier to integrate with `fp-ts`, `Effect`, or even other libraries.

The learning curve of `std-types` should be easier than `fp-ts` or `Effect`, and it should be more familiar to Rust developers who might not be familiar with functional programming or generator functions. This library provides a straightforward approach in an imperative programming style.

## Roadmap

Here are some planned features and improvements for `std-types`:

- **Enhanced Documentation**: Provide more detailed guides, API documentation, and use cases.
- **More Examples**: Add a variety of examples covering different scenarios and use cases.
- **Performance Optimizations**: Continuously improve the performance of the library.
- **Additional Utility Functions**: Introduce more utility functions and data structures that align with the project's philosophy.
- **Community Contributions**: Encourage and integrate contributions from the community to enhance the library's functionality and usability.

## Contributing

We welcome contributions from the community. If you'd like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -am 'Add some feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a new Pull Request.

Please make sure to write tests for any new features or bug fixes and adhere to the project's coding standards.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

## Acknowledgements

This library is heavily inspired by Rust's standard library, particularly the `Result` and `Option` types. Special thanks to the contributors and maintainers of Rust and TypeScript for their exceptional work.

## Contact

For questions or feedback, please open an issue on GitHub or contact the maintainer directly at [thada.wth@gmail.com](mailto:thada.wth@gmail.com).