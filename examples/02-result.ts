import { Std } from "../src";

export const divide = (a: number, b: number): Std.Result<number, string> => {
  if (b === 0) {
    return Std.err("Cannot divide by zero");
  }
  return Std.ok(a / b);
};
