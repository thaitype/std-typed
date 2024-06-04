import { Std, Number } from "./libs";

// function parseNumberAndLogStr(
//   str: string
// ): Std.Result<number, Number.ParseNumberError> {
//   const num = parseNumber(str)
//   return num;
// }

const parseNumberAndLogStr = (
  str: string
): Std.Result<number, Number.ParseIntError> =>
  Std.try(() => {
    const num = Number.parseInt(str).eval();
    // console.log(`Parsed number successfully: ${num}`);
    return Std.ok(num);
  });

Std.runExit(async () => {
  const strVec = Std.vec(["", "333", "30", "23,00", "50"]);
  for (const item of strVec) {
    const num = parseNumberAndLogStr(item);
    console.log(`Result: ${num.toString()}`);
  }
});
