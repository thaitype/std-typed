import { Std } from "../libs";

function main() {
  const vec = Std.vec([1, 2, 3, 4, 5]);
  console.log(`Len = ${vec.len()}`);
  console.log(`Get(2) = ${vec.get(2)}`);
  console.log(`Pop() = ${vec.pop()}`);
  console.log(`Remove(2) = ${vec.remove(2)}`);
  console.log(`Debug = ${vec}`);

  const vec2 = Std.vec([{ a: 1 }, { a: 2 }, { a: 3 }]);
  console.log(`Len = ${vec2.len()}`);
  console.log(`Debug = ${vec2.toString({ pretty: true })}`);
}

main();
