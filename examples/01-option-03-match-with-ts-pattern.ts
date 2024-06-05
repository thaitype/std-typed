import { Std } from "std-typed";
import { tryTakeSecond } from "./01-option";
import { match } from "ts-pattern";

for (const value of [[1], [1, 2, 3]]) {
  const result = tryTakeSecond(value);
  match(result.toObject())
    .with(Std._Some, ({ value }) => console.log(`Some(${value})`))
    .with(Std._None, () => console.log("None"))
    .exhaustive();
}
