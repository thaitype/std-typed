import { test, expect } from 'bun:test';
import { isPromise } from './predicate';


test('isPromise', () => {
  expect(isPromise(Promise.resolve(1))).toStrictEqual(true);
  expect(isPromise(1)).toStrictEqual(false);
  expect(isPromise({ then: () => {}, catch: () => {} })).toStrictEqual(true);
  expect(isPromise({ then: () => {} })).toStrictEqual(false);
  expect(isPromise({ catch: () => {} })).toStrictEqual(false);
  expect(isPromise({})).toStrictEqual(false);
});