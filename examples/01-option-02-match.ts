import { tryTakeSecond } from "./01-option";
import { match } from "ts-pattern";

for (const value of [[1], [1, 2, 3]]) {
  const result = tryTakeSecond(value);
  result.match({
    some: (value) => console.log(`Some(${value})`),
    none: () => console.log("None"),
  });

  // match(result.toObject())
  //   .with({ _tag: "some" }, ({ value }) => console.log(`Some(${value})`))
  //   .with({ _tag: "none" }, () => console.log("None"))
  //   .exhaustive();
}
