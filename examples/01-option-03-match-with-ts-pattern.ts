import { Option } from "std-typed";
import { tryTakeSecond } from "./01-option.js";
import { match } from "ts-pattern";

for (const value of [[1], [1, 2, 3]]) {
  const result = tryTakeSecond(value);
  match(result.into())
    .with(Option._Some, ({ value }) => console.log(`Some(${value})`))
    .with(Option._None, () => console.log("None"))
    .exhaustive();
}
