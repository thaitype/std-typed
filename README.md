# Standard Typed

Experimental Implementation of the standard library for the TypeScript, inspired by Rust's standard library.

## Project Philosophy

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



