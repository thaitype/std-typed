import { divide } from "./02-result";
import { match } from "ts-pattern";
import { Std } from "../src";

for (const [a, b] of [
  [1, 0],
  [1, 2],
]) {
  const result = divide(a, b);
  match(result.toObject())
    .with(Std._Ok, ({ value }) => console.log(`Dividing ${a} by ${b} = ${value}`))
    .with(Std._Err, ({ error }) =>
      console.log(`Dividing ${a} by ${b} failed: ${error}`)
    )
    .exhaustive();
}