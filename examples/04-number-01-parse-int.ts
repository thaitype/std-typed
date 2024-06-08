import { Std, StdNumber, StdArray, Result } from "std-typed";

const parseNumberAndLogStr = (str: string) =>
  Result.func<number, StdNumber.ParseIntError>(() => {
    const num = StdNumber.parseInt(str).unwrapOrThrow();
    console.log(`Parsed number successfully: ${num}`);
    return Result.ok(num);
  });

Std.runExit(async () => {
  const strArray = StdArray.from([
    "",
    "0",
    "23,00",
    "40",
    "seven",
    "11111111111111111111111111",
  ]);
  for (const item of strArray) {
    const num = parseNumberAndLogStr(item);
    console.log(`Result: ${num.toString()}`);
  }
});
