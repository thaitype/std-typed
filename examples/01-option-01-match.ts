import { tryTakeSecond } from "./01-option-01";

for (const value of [[1], [1, 2, 3]]) {
  const result = tryTakeSecond(value);
  result.match({
    some: (value) => console.log(`Some(${value})`),
    none: () => console.log("None"),
  });
}
