
/**
 * Rust inspired Result type for TypeScript
 * @ref https://dev.to/alexanderop/robust-error-handling-in-typescript-a-journey-from-naive-to-rust-inspired-solutions-1mdh
 */
export type Result<T, E> = Ok<T> | Err<E>;

export class ResultBase<T, E> {
  public value!: T;
  public error!: E;
  protected readonly _tag: "success" | "failure" = "success";

  isOk(): this is Ok<T> {
    return this._tag === "success";
  }

  isErr(): this is Err<E> {
    return this._tag === "failure";
  }

  match<U>(pattern: {
    success: (value: T) => U;
    failure: (error: E) => U;
  }): U {
    return this.isOk() ? pattern.success(this.value) : pattern.failure(this.error);
  }
}

export function ok<T>(value: T): Ok<T> {
  return new Ok(value);
}

export class Ok<T> extends ResultBase<T, never> {
  protected readonly _tag = "success";
  constructor(public value: T) {
    super();
  }
}

export function err<E>(error: E): Err<E> {
  return new Err(error);
}

export class Err<E> extends ResultBase<never, E>{
  protected readonly _tag = "failure";
  constructor(public error: E) {
    super();
  }
}
