import type { ToStringOptions } from "./types.js";
import * as Option from "./option.js";
/**
 * Rust inspired Vector type for TypeScript
 */
export class Vec<T> {
  constructor(protected readonly value: T[]) {}

  static from<T>(value: T[]): Vec<T> {
    return new Vec(value);
  }

  into(): T[] {
    return this.value;
  }

  toList(): T[] {
    return this.value;
  }

  /**
   * Appends an element to the back of a collection.
   * @param value The value to be pushed.
   */
  push(value: T): Vec<T> {
    this.value.push(value);
    return this;
  }

  /**
   * Returns the number of elements in the vector, also referred to as its ‘length’.
   * @returns The number of elements in the vector.
   */
  len(): number {
    return this.value.length;
  }

  /**
   * Get the element at the given index
   * @param index
   * @returns Returns the element at the given index, or `None` if the index is out of bounds.
   */
  get(index: number): Option.Option<T> {
    if (index < 0 || index >= this.value.length) return Option.none;
    return Option.some(this.value[index]);
  }

  /**
   * Removes the last element from a vector and returns it, or None if it is empty.
   * @returns The last element of the vector, or None if it is empty.
   */
  pop(): Option.Option<T> {
    if (this.value.length === 0) return Option.none;
    const value = this.value.pop();
    if (value === undefined) return Option.none;
    return Option.some(value);
  }
  /**
   * Removes and returns the element at position index within the vector, shifting all elements after it to the left.
   */
  remove(index: number): Option.Option<T> {
    if (index < 0 || index >= this.value.length) return Option.none;
    const value = this.value.splice(index, 1)[0];
    return Option.some(value);
  }

  toString(options?: ToStringOptions): string {
    const value = options?.pretty === true ? JSON.stringify(this.value, null, 2) : JSON.stringify(this.value);
    return `Vec(${value})`;
  }

  [Symbol.iterator]() {
    return this.value[Symbol.iterator]();
  }
}

/**
 * Create a new Vec
 * @param value Using an array
 */
export function vec<T>(value: T[]): Vec<T> {
  return Vec.from(value);
}
