import { Std } from "std-typed";
import { tryTakeSecond } from "./01-option";
import { Match } from "effect";

/**
 * Using match may more hard to read, use `get` instead,
 *
 * Trick: use `get` to unwrap the value from the Result, throwing an error if it's an Err
 * combine with `Std.try` to handle the error.
 */

const tryTakeSecondAndLog = (value: number[]): Std.Result<number, any> =>
  Std.try(() => {
    const result = tryTakeSecond(value).get();
    console.log(`The second element is ${result}`);
    return Std.ok(result);
  });

Std.runExit(() => {
  for (const value of [[1], [1, 2, 3]]) {
    const result = tryTakeSecondAndLog(value).match({
      ok: (value) => `${value}`,
      err: (error) => `${error}`,
    })
    console.log(result);
  }
});
