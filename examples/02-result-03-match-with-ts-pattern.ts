import { divide } from "./02-result.js";
import { match } from "ts-pattern";
import { Result } from "std-typed";

for (const [a, b] of [
  [1, 0],
  [1, 2],
]) {
  const result = divide(a, b);
  match(result.toObject())
    .with(Result._Ok, ({ value }) => console.log(`Dividing ${a} by ${b} = ${value}`))
    .with(Result._Err, ({ error }) =>
      console.log(`Dividing ${a} by ${b} failed: ${error}`)
    )
    .exhaustive();
}
