import GraphemeSplitter from "grapheme-splitter";
import { toGenerator } from "./Utils.js";
import { cons } from "effect/List";

/**
 * 1 single charcode should not be more than 1 bytes
 * convert the charcode when it is more than 1 bytes
 * @deprecated using TextEncoder instead
 * @param code
 */
function splitCharCode(code: number): number[] {
  if (code <= 0x7f) {
    return [code];
  } else if (code <= 0x7ff) {
    return [0xc0 | (code >> 6), 0x80 | (code & 0x3f)];
  } else if (code <= 0xffff) {
    return [0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f)];
  } else {
    return [0xf0 | (code >> 18), 0x80 | ((code >> 12) & 0x3f), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f)];
  }
}

/**
 * A UTF-8–encoded string, representing a sequence of Unicode scalar values
 */
export function from(value: string): String {
  return new String(value);
}

export class String {
  constructor(private value: string) {}

  /**
   * Return an generator over the string's characters
   *
   * @link https://doc.rust-lang.org/std/string/struct.String.html#method.chars
   */
  chars(): Generator<string, void> {
    // return new GraphemeSplitter().iterateGraphemes(this.value);
    return toGenerator(new GraphemeSplitter().iterateGraphemes(this.value));
  }

  bytes(): StdGenerator<number, void> {
    const value = new GraphemeSplitter().iterateGraphemes(this.value);
    return new StdGenerator(function* () {
      const encoder = new TextEncoder();
      for (const char of value) {
        const encoded = encoder.encode(char);
        for (const byte of encoded) {
          yield byte;
        }
      }
    });
  }

  /**
   * Returns the string representation of the String
   */
  toString(): string {
    return this.value;
  }
}

class StdGenerator<T = unknown, TReturn = any> implements Generator<T, TReturn, unknown> {
  private generator: Generator<T, TReturn, unknown>;

  constructor(generatorFunction: () => Generator<T, TReturn, unknown>) {
    this.generator = generatorFunction();
  }

  next(...args: [] | [unknown]): IteratorResult<T, TReturn> {
    const result = this.generator.next(...args);
    return result;
  }

  return(value?: any): IteratorResult<T, TReturn> {
    return this.generator.return(value);
  }

  throw(e?: any): IteratorResult<T, TReturn> {
    return this.generator.throw(e);
  }

  [Symbol.iterator](): Generator<T, TReturn, unknown> {
    return this;
  }

  // Custom method to get the count of yielded values
  count(): number {
    let count = 0;
    while (!this.next().done) {
      count++;
    }
    return count;
  }
}
