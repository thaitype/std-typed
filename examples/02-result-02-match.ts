import { divide } from "./02-result.js";

for (const [a, b] of [
  [1, 0],
  [1, 2],
]) {
  divide(a, b).match({
    ok: (value) => console.log(`Dividing ${a} by ${b} = ${value}`),
    err: (error) => console.log(`Dividing ${a} by ${b} failed: ${error}`),
  });
}
