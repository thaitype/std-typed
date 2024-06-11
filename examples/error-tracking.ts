// Error Tracking in https://effect.website/docs/guides/error-management/expected-errors

import { Result } from "std-typed";
import { match } from "ts-pattern";

type ProgramError = "FooError" | "BarError";

function program(): Result.Result<string, ProgramError> {
  const n1 = Math.random();
  const n2 = Math.random();

  let foo = "";
  if (n1 > 0.2) {
    foo = "yay!";
  } else {
    return Result.err("FooError");
  }

  let bar = "";
  if (n2 > 0.2) {
    bar = "yay!";
  } else {
    return Result.err("BarError");
  }

  return Result.ok(foo + bar);
}

const result = program();
match(result.into())
  .with(result.ok(), (value) => console.log(`Ok(${value.value})`))
  .with({ ...result.err(), error: "FooError" }, (error) => console.log(`>> ${error.error}`))
  .with({ ...result.err(), error: "BarError" }, (error) => console.log(`>> ${error.error}`))
  .exhaustive();
