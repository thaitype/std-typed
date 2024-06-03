import { Std } from "./libs";

function tryTakeFifth(value: number[]): Std.Option<number> {
  if (value.length < 5) {
    return Std.none;
  } else {
    return Std.some(value[4]);
  }
}

Std.runExit(async () => {
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