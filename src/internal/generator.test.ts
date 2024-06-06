import { test, expect } from "bun:test";
import { AggregatedGenerator, BaseGenerator } from "./generator.js";

test("BaseGenerator can initiate and act like Generator", () => {
  const generator = new BaseGenerator(function* () {
    yield 1;
    yield 2;
    yield 3;
  });

  expect(generator.next()).toStrictEqual({ value: 1, done: false });
  expect(generator.next()).toStrictEqual({ value: 2, done: false });
  expect(generator.next()).toStrictEqual({ value: 3, done: false });
  expect(generator.next()).toStrictEqual({ value: undefined, done: true });
});

test("AggregatedGenerator can count", () => {
  const generator = new BaseGenerator(function* () {
    yield 1;
    yield 2;
    yield 3;
  });

  const aggregatedGenerator = new AggregatedGenerator(function* () {
    yield* generator;
  });

  expect(aggregatedGenerator.count()).toBe(3);
});

test("AggregatedGenerator can convert to array", () => {
  const generator = new BaseGenerator(function* () {
    yield 1;
    yield 2;
    yield 3;
  });

  const aggregatedGenerator = new AggregatedGenerator(function* () {
    yield* generator;
  });

  expect(aggregatedGenerator.toArray()).toStrictEqual([1, 2, 3]);
});