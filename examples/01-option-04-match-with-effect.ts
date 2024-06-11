import { Match } from "effect";
import { Option } from "std-typed";
import { tryTakeSecond } from "./01-option.js";

for (const value of [[1], [1, 2, 3]]) {
  const result = tryTakeSecond(value);
  Match.value(result.into()).pipe(
    Match.when(result.some(), ({ value }) => console.log(`Some(${value})`)),
    Match.when(result.none(), () => console.log("None")),
    Match.exhaustive
  );
}
