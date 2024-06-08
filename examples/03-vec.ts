import { StdArray } from "std-typed";

function main() {
  const array = StdArray.from([1, 2, 3, 4, 5]);
  console.log(`Len = ${array.length}`);
  console.log(`Get(2) = ${array.get(2)}`);
  console.log(`Pop() = ${array.pop()}`);
  console.log(`Remove(2) = ${array.remove(2)}`);
  console.log(`Debug = ${array}`);

  const array2 = StdArray.from([{ a: 1 }, { a: 2 }, { a: 3 }]);
  console.log(`Len = ${array2.length}`);
  console.log(`Debug = ${array2.toString({ pretty: true })}`);
}

main();
