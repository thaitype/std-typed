import { Std } from "./libs";
import { parseNumber, type ParseNumberError } from "./libs/number";

function parseNumberAndLogStr(
  str: string
): Std.Result<number, ParseNumberError> {
  const num = parseNumber(str);
  return num;
}

Std.runExit(async () => {
  const strVec = Std.vec(["nice", "20", "30", "40", "seven", "50"]);
  for (const item of strVec) {
    const num = parseNumberAndLogStr(item);
    console.log(`Parsed number: ${num}`);
  }
});
