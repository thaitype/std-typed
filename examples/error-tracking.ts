// Error Tracking in https://effect.website/docs/guides/error-management/expected-errors

import { match } from "ts-pattern";
import { Result } from "std-typed";

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

match(program().into())
  .with({ _tag: 'success' }, (value) => console.log(`Ok(${value.value})`))
  .with({ _tag: 'failure', error: 'FooError'}, (error) => console.log(`>> ${error.error}`)) 
  .with({ _tag: 'failure', error: 'BarError'}, (error) => console.log(`>> ${error.error}`))
  .exhaustive();



