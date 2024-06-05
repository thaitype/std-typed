import * as Result from "./Result.js";

/**
 * From Rust's `std::num::ParseIntError`
 */
export class ParseIntError {
  constructor(public readonly kind: "Empty" | "InvalidDigit" | "PosOverflow" | "NegOverflow" | "Zero") {}
}

function parseInt_(str: string): Result.Result<number, ParseIntError> {
  const trimmed = str.trim();
  if (trimmed === "") {
    return Result.err(new ParseIntError("Empty"));
  }
  const parsed = Number(str);
  if (isNaN(parsed)) {
    return Result.err(new ParseIntError("InvalidDigit"));
  }
  /**
   * @ref https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER
   */
  if (parsed > Number.MAX_SAFE_INTEGER) {
    return Result.err(new ParseIntError("PosOverflow"));
  }
  /**
   * @ref https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MIN_SAFE_INTEGER
   */
  if (parsed < Number.MIN_SAFE_INTEGER) {
    return Result.err(new ParseIntError("NegOverflow"));
  }
  return Result.ok(parsed);
}

export { parseInt_ as parseInt };
