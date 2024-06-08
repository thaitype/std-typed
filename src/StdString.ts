import GraphemeSplitter from "grapheme-splitter";
import { AggregatedGenerator } from "./internal/generator.js";
import * as Result from "./Result.js";
import { StdError } from "./Std.js";

/**
 * From Rust's `std::string::FromUtf8Error`
 */
export class FromUtf8Error extends StdError<"InvalidUtf8"> {}

/**
 * A UTF-8–encoded string, representing a sequence of Unicode scalar values
 */
export function from(value: string): StdString {
  return new StdString(value);
}

/**
 * Convert a slice of bytes to a `String`.
 *
 * @ref https://doc.rust-lang.org/stable/alloc/string/struct.String.html#method.from_utf8
 */
export function fromUtf8(bytes: number[]): Result.Result<StdString, FromUtf8Error> {
  const buffer = Buffer.from(bytes);
  if (!isValidUtf8(buffer)) {
    return Result.err(new FromUtf8Error("InvalidUtf8"));
  }
  return Result.ok(new StdString(buffer.toString("utf8")));
}

export class StdString {
  constructor(private value: string) {}

  static from = from;
  static fromUtf8 = fromUtf8;

  /**
   * Return an generator over the string's characters
   *
   * @link https://doc.rust-lang.org/std/string/struct.String.html#method.chars
   */
  chars(): AggregatedGenerator<string, void> {
    const graphemes = new GraphemeSplitter().iterateGraphemes(this.value);
    return new AggregatedGenerator(function* () {
      yield* graphemes;
    });
  }

  bytes(): AggregatedGenerator<number, void> {
    const value = new GraphemeSplitter().iterateGraphemes(this.value);
    return new AggregatedGenerator(function* () {
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

/**
 * 1 single charcode should not be more than 1 bytes
 * convert the charcode when it is more than 1 bytes
 * @deprecated using TextEncoder instead
 * @param code
 */
export function splitCharCode(code: number): number[] {
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
 * Check if a buffer is valid UTF-8
 * @param buffer
 * @returns
 */

export function isValidUtf8(buffer: Buffer) {
  try {
    // Decode the buffer and re-encode it to see if it matches the original
    const decodedString = buffer.toString("utf8");
    const reencodedBuffer = Buffer.from(decodedString, "utf8");
    return buffer.equals(reencodedBuffer);
  } catch (e) {
    return false;
  }
}
