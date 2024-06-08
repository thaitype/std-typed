import type { Equal, Expect } from "@type-challenges/utils";
// ------ Utility Types ------

export type ExcludeNeverKey<T, K extends keyof any> = T extends Record<K, never> ? never : T;

type Cases = [
  // Confirm the union of never
  Expect<Equal<ExcludeNeverKey<{ a: string; b: never } | { a: string; b: "BBB" }, "b">, { a: string; b: "BBB" }>>,
  // Otherwise, return the original type
  Expect<Equal<ExcludeNeverKey<{ a: string; b: number }, "b">, { a: string; b: number }>>,
  Expect<Equal<ExcludeNeverKey<{ a: string; b: number | never }, "b">, { a: string; b: number }>>,
  Expect<Equal<ExcludeNeverKey<{ a: string; b: number | never }, "a">, { a: string; b: number | never }>>,
  Expect<Equal<ExcludeNeverKey<{ a: string; b: never }, "a">, { a: string; b: never }>>
];

// ------ Shape Types ------

export type PromiseLike<T> = T | Promise<T>;

export interface ToStringOptions {
  pretty?: boolean;
}
/**
 * For discriminated union types, it's a common pattern to have a `_tag` property
 */
export interface Tagged<T extends string> {
  _tag: T;
}

export interface Transformable {
  into(): unknown;
  toString(options?: ToStringOptions): string;
}

export interface Unwrapable<T> {
  unwrap(): T;
}

export interface Composable<T> {
  /**
   * Unwraps the value from the Result, throwing an error if it's an Err
   *
   * When using `$get` operator, this may cause throw error, for safety, requires to use with `Std.fun`.
   *
   * Inspired by Rust's `?` operator
   *
   * @ref https://doc.rust-lang.org/reference/expressions/operator-expr.html#the-question-mark-operator
   * @throws {Err} throw when it doesn't match the condition
   */
  $get: T;
}

export interface Matchable {
  match(...args: unknown[]): unknown;
}
