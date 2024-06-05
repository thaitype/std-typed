import { Std, pipe } from "std-typed";

const valid = pipe(
  "323",
  (a: string) => Number(a),
  (b: number) => b + 1,
  (d: number) => `${d}`,
  (e: string) => Number(e)
); // 324

