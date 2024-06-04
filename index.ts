import { Std } from "./libs";
import { parseNumber, type ParseNumberError } from "./libs/number";

// function parseNumberAndLogStr(
//   str: string
// ): Std.Result<number, ParseNumberError> {
//   const num = parseNumber(str)
//   return num;
// }

const parseNumberAndLogStr = (
  str: string
): Std.Result<number, ParseNumberError> =>
  Std.try(() => {
    const num = parseNumber(str).eval();
    // console.log(`Parsed number successfully: ${num}`);
    return Std.ok(num);
  });

Std.runExit(async () => {
  const strVec = Std.vec(["nice", "20", "30", "23,00", "50"]);
  for (const item of strVec) {
    const num = parseNumberAndLogStr(item);
    console.log(`Result: ${num.toString()}`);
  }
});
