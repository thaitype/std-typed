import { err, ok, type Result } from "./result";

/**
 * From Rust's `std::num::ParseIntError`
 *
 * Note: ParseInt is duplicated in JavaScript's `parseInt` function
 */
export class ParseNumberError {
  constructor(
    public readonly kind:
      | "Empty"
      | "InvalidDigit"
      | "PosOverflow"
      | "NegOverflow"
      | "Zero"
  ) {}
}

export function parseNumber(str: string): Result<number, ParseNumberError> {
  const num = parseInt(str);
  if (isNaN(num)) {
    return err(new ParseNumberError("InvalidDigit"));
  }
  return ok(num);
}
