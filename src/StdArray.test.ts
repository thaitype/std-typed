import { expect, test } from "bun:test";
import { some } from "./Option.js";
import * as StdArray from "./StdArray.js";

test("StdArray", () => {
  const array = StdArray.from([1, 2, 3, 4, 5]);
  expect(array.length).toStrictEqual(5);
  expect(array.get(2)).toStrictEqual(some(3));
  expect(array.pop()).toStrictEqual(some(5));
  expect(array.remove(2)).toStrictEqual(some(3));
  expect(array.into()).toStrictEqual([1, 2, 4]);
  expect(array.toString()).toStrictEqual("StdArray([1,2,4])");

  const array2 = StdArray.from([{ a: 1 }, { a: 2 }, { a: 3 }]);
  expect(array2.length).toStrictEqual(3);
  expect(array2.toString({ pretty: true })).toStrictEqual(
    "StdArray([\n  {\n    \"a\": 1\n  },\n  {\n    \"a\": 2\n  },\n  {\n    \"a\": 3\n  }\n])"
  );
});
