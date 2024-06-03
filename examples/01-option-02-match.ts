import { tryTakeSecond } from "./01-option";

for (const value of [[1], [1, 2, 3]]) {
  tryTakeSecond(value).match({
    some: (value) => console.log(`Some(${value})`),
    none: () => console.log("None"),
  });
}
