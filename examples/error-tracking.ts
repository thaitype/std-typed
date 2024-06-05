// Error Tracking in https://effect.website/docs/guides/error-management/expected-errors

import { match } from "ts-pattern";
import { Result } from "std-typed";

type ProgramError = "FooError" | "BarError";

function program(): Result.Result<string, ProgramError> {
  const n1 = Math.random();
  const n2 = Math.random();

  let foo = "";
  if (n1 > 0.5) {
    foo = "yay!";
  } else {
    return Result.err("FooError");
  }

  let bar = "";
  if (n2 > 0.5) {
    bar = "yay!";
  } else {
    return Result.err("BarError");
  }

  return Result.ok(foo + bar);
}

function recover(error: ProgramError) {
  match(error)
    .with("FooError", () => console.log(">> FooError"))
    .with("BarError", () => console.log(">> BarError"))
    .exhaustive();
}

program().match({
  ok: value => console.log(`Program result: ${value}`),
  err: error => recover(error),
});
