import { Std, _Number } from "../src";

const parseNumberAndLogStr = (str: string): Std.Result<number, _Number.ParseIntError> =>
  Std.try(() => {
    const num = _Number.parseInt(str).get();
    console.log(`Parsed number successfully: ${num}`);
    return Std.ok(num);
  });


Std.runExit(async () => {
  const strVec = Std.vec(["", "0", "23,00", "40", "seven", "11111111111111111111111111"]);
  for (const item of strVec) {
    const num = parseNumberAndLogStr(item);
    console.log(`Result: ${num.toString()}`);
  }
});
