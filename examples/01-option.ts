import { Std } from "../libs";

export function tryTakeSecond(value: number[]): Std.Option<number> {
  if (value.length < 2) {
    return Std.none;
  } else {
    return Std.some(value[1]);
  }
}
