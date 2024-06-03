import { divide } from "./02-result";

for (const [a, b] of [
  [1, 0],
  [1, 2],
]) {
  const result = divide(a, b);
  result.match({
    success: (value) => console.log(`Dividing ${a} by ${b} = ${value}`),
    failure: (error) => console.log(`Dividing ${a} by ${b} failed: ${error}`),
  });
}
