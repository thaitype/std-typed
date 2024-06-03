// Error Tracking in https://effect.website/docs/guides/error-management/expected-errors

import { err, ok } from "../libs/result";
import { match } from "ts-pattern";
import { T } from "../libs";

type ProgramError = "FooError" | "BarError";

function program(): T.Result<string, ProgramError> {
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
