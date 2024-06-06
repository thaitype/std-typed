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
  toObject(): unknown;
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
