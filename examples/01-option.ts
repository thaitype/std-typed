import { Option } from "std-typed";

export function tryTakeSecond(value: number[]): Option.Option<number> {
  if (value.length < 2) {
    return Option.none;
  } else {
    return Option.some(value[1]);
  }
}
