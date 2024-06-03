
// /**
//  * Rust inspired Option type for TypeScript
//  * @ref https://dev.to/alexanderop/robust-error-handling-in-typescript-a-journey-from-naive-to-rust-inspired-solutions-1mdh
//  */

export type Option<T> = Some<T> | None<T>;

export class OptionBase<T> {
  protected readonly _tag: "some" | "none" = "some";

  isSome(): this is Some<T> {
    return this._tag === "some";
  }
  
  match<U>(pattern: {
    some: (value: T) => U;
    none: () => U;
  }): U {
    return this.isSome() ? pattern.some(this.unwrap()) : pattern.none();
  }
    
}

export function some<T>(value: T): Some<T> {
  return new Some(value);
}

export class Some<T> extends OptionBase<T> {
  protected readonly _tag = "some";
  constructor(public value: T) {
    super();
  }

  unwrap(): T {
    return this.value;
  }
}

export class None<T = never> extends OptionBase<T> {
  protected readonly _tag = "none";
}

export const none: None = new None();

