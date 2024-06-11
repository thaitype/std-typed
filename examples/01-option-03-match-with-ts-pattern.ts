import { Option } from "std-typed";
import { match } from "ts-pattern";
import { tryTakeSecond } from "./01-option.js";

for (const value of [[1], [1, 2, 3]]) {
  const result = tryTakeSecond(value);
  match(result.into())
    .with(result.some(), ({ value }) => console.log(`Some(${value})`))
    .with(result.none(), () => console.log("None"))
    .exhaustive();
}
