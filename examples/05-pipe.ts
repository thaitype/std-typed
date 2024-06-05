import { Std } from "std-typed";

const valid = Std.pipe(
  "323",
  (a: string) => Number(a),
  (c: number) => c + 1,
  (d: number) => `${d}`,
  (e: string) => Number(e)
);

console.log(`Valid: ${valid + 1}`);