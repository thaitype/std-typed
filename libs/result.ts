
/**
 * Rust inspired Result type for TypeScript
 * @ref https://dev.to/alexanderop/robust-error-handling-in-typescript-a-journey-from-naive-to-rust-inspired-solutions-1mdh
 */
export type Result<T, E> = Ok<T> | Err<E>;

export class ResultBase {
  protected readonly _tag: "success" | "failure" = "success";
}

export function ok<T>(value: T): Ok<T> {
  return new Ok(value);
}

export class Ok<T> extends ResultBase {
  protected readonly _tag = "success";
  constructor(public value: T) {
    super();
  }
}

export function err<E>(error: E): Err<E> {
  return new Err(error);
}

export class Err<E> extends ResultBase {
  protected readonly _tag = "failure";
  constructor(public error: E) {
    super();
  }
}