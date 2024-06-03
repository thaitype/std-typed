import { T } from "../libs";
import { tryTakeSecond } from "./01-option";
import { match } from "ts-pattern";

for (const value of [[1], [1, 2, 3]]) {
  const result = tryTakeSecond(value);
  match(result.toObject())
    .with(T._Some, ({ value }) => console.log(`Some(${value})`))
    .with(T._None, () => console.log("None"))
    .exhaustive();
}
