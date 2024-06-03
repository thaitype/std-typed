import { divide } from "./02-result";
import { match } from "ts-pattern";
import { T } from "../libs";

for (const [a, b] of [
  [1, 0],
  [1, 2],
]) {
  const result = divide(a, b);
  match(result.toObject())
    .with(T._Ok, ({ value }) => console.log(`Dividing ${a} by ${b} = ${value}`))
    .with(T._Err, ({ error }) =>
      console.log(`Dividing ${a} by ${b} failed: ${error}`)
    )
    .exhaustive();
}
