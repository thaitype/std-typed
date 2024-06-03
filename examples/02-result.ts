import { T } from "../libs";

export const divide = (a: number, b: number): T.Result<number, string> => {
  if (b === 0) {
    return T.err("Cannot divide by zero");
  }
  return T.ok(a / b);
};
