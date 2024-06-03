import { T } from "./libs";

function tryTakeFifth(value: number[]): T.Option<number> {
  if (value.length < 5) {
    return T.none;
  } else {
    return T.some(value[4]);
  }
}

T.runExit(async () => {
  for (const value of [
    [1, 2],
    [1, 2, 3, 4, 5],
  ]) {
    const result = tryTakeFifth(value);

    result.match({
      some: (value) => console.log(`Some(${value})`),
      none: () => console.log("None"),
    });
  }
});