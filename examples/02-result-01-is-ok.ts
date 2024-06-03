import { divide } from "./02-result";

for(const [a, b] of [[1, 0], [1, 2]]) {
  const result = divide(a, b);
  if (result.isOk()) {
    console.log(`Dividing ${a} by ${b} = ${result.value}`);
  } else {
    console.log(`Dividing ${a} by ${b} failed: ${result.error}`);
  }
}