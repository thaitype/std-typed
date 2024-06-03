import { T } from "./libs";
import { match, P } from "ts-pattern";

// function divide(a: number, b: number): T.Result<number, string> {
//   if (b === 0) {
//     return T.err("Cannot divide by zero");
//   }
//   return T.ok(a / b);
// }

// console.log(divide(10, 2));

// function getDataFromList(list: string[], index: number): T.Option<string> {
//   if (index >= list.length) {
//     return T.none;
//   }
//   return T.some(list[index]);
// }

// console.log(getDataFromList(["a", "b", "c"], 10));

function tryTakeFifth(value: number[]): T.Option<number> {
  if (value.length < 5) {
    return T.none;
  } else {
    return T.some(value[4]);
  }
}

for (const value of [
  [1, 2],
  [1, 2, 3, 4, 5],
]) {
  const result = tryTakeFifth(value);
  // if (result.isSome()) {
  //   console.log(`Some(${result.unwrap()})`);
  // } else {
  //   console.log("None");
  // }

  result.match({
    some: (value) => console.log(`Some(${value})`),
    none: () => console.log("None"),
  })
}
