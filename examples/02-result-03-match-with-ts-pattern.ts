import { Result } from "std-typed";
import { match } from "ts-pattern";
import { divide } from "./02-result.js";

for (
  const [a, b] of [
    [1, 0],
    [1, 2]
  ]
) {
  const result = divide(a, b);
  match(result.into())
    .with(result.ok(), ({ value }) => console.log(`Dividing ${a} by ${b} = ${value}`))
    .with(result.err(), ({ error }) => console.log(`Dividing ${a} by ${b} failed: ${error}`))
    .exhaustive();
}
