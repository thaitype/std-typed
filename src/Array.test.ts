import { test, expect } from "bun:test";
import * as Array from "./Array.js";
import { some } from "./Option.js";

test("Vec", () => {
  const v = Array.from([1, 2, 3, 4, 5]);
  expect(v.length).toStrictEqual(5);
  expect(v.get(2)).toStrictEqual(some(3));
  expect(v.pop()).toStrictEqual(some(5));
  expect(v.remove(2)).toStrictEqual(some(3));
  expect(v.into()).toStrictEqual([1, 2, 4]);
  expect(v.toString()).toStrictEqual("Vec([1,2,4])");

  const v2 = Array.from([{ a: 1 }, { a: 2 }, { a: 3 }]);
  expect(v2.length).toStrictEqual(3);
  expect(v2.toString({ pretty: true })).toStrictEqual(
    'Vec([\n  {\n    "a": 1\n  },\n  {\n    "a": 2\n  },\n  {\n    "a": 3\n  }\n])'
  );
});
