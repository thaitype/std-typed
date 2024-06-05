import { Result } from "std-typed";

export const divide = (a: number, b: number): Result.Result<number, string> => {
  if (b === 0) {
    return Result.err("Cannot divide by zero");
  }
  return Result.ok(a / b);
};
