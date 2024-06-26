import type { ToStringOptions } from "./types.js";
import * as Option from "./Option.js";
/**
 * Create a new Array from a value
 * @param value Using an array
 */
export function from<T>(value: T[]): StdArray<T> {
  return new StdArray(value);
}

/**
 * Array Type Wrapping with Result
 * 
 * Rust inspired Vector type for TypeScript
 */
export class StdArray<T> {
  constructor(protected readonly value: T[]) {}

  static from = from;
  
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
  push(value: T): StdArray<T> {
    this.value.push(value);
    return this;
  }

  /**
   * Returns the number of elements in the vector, also referred to as its ‘length’.
   * @returns The number of elements in the vector.
   */
  get length(): number {
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
    return `${StdArray.name}(${value})`;
  }

  [Symbol.iterator]() {
    return this.value[Symbol.iterator]();
  }
}

