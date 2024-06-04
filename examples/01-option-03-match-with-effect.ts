import { Std } from "../libs";
import { tryTakeSecond } from "./01-option";
import { Match } from "effect";

for (const value of [[1], [1, 2, 3]]) {
  const result = tryTakeSecond(value);
  Match.value(result.toObject()).pipe(
    Match.when(Std._Some, ({ value }) => console.log(`Some(${value})`)),
    Match.when(Std._None, () => console.log("None")),
    Match.exhaustive
  )
}

