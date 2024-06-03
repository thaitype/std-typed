import { T } from "../libs";

export function tryTakeSecond(value: number[]): T.Option<number> {
  if (value.length < 2) {
    return T.none;
  } else {
    return T.some(value[1]);
  }
}
