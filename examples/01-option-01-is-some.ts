import { tryTakeSecond } from "./01-option-01";

for (const value of [[1], [1, 2, 3]]) {
  const result = tryTakeSecond(value);
  if (result.isSome()) {
    console.log(`Some(${result.unwrap()})`);
  } else {
    console.log("None");
  }
}
