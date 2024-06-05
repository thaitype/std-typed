import { Std, pipe } from "std-typed";

const valid = pipe(
  "323",
  (a: string) => Number(a),
  (b: number) => b + 1,
  // (a: string) => Std._Number.parseInt(a),
  // (c: Std.Result<number, Std._Number.ParseIntError>) =>,
  (d: number) => `${d}`,
  (e: string) => Number(e)
);

console.log(`Valid: ${valid + 1}`);
