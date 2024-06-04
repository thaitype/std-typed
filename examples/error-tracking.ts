// Error Tracking in https://effect.website/docs/guides/error-management/expected-errors

import { err, ok } from "../src/result";
import { match } from "ts-pattern";
import { Std } from "../src";

type ProgramError = "FooError" | "BarError";

function program(): Std.Result<string, ProgramError> {
  const n1 = Math.random();
  const n2 = Math.random();

  let foo = "";
  if (n1 > 0.5) {
    foo = "yay!";
  } else {
    return err("FooError");
  }

  let bar = "";
  if (n2 > 0.5) {
    bar = "yay!";
  } else {
    return err("BarError");
  }

  return ok(foo + bar);
}

function recover(error: ProgramError) {
  match(error)
    .with("FooError", () => console.log(">> FooError"))
    .with("BarError", () => console.log(">> BarError"))
    .exhaustive();
}

program().match({
  ok: (value) => console.log(`Program result: ${value}`),
  err: (error) => recover(error),
});
