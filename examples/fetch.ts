import { Result, Std } from "std-typed";

const callApi = (): Promise<Result.Result<number, unknown>> =>
  Std.funcAsync(async () => {
    await Std.delay(1000);
    return Result.ok(123);
  });
/**
 * Delay for a specified amount of time
 * @param ms value in milliseconds
 * @returns Promise of void
 */
export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

Std.runExit(async () => {
  console.log(`${await callApi()}`);
});
