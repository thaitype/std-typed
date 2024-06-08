export * from './internal/generator.js'
export * from './internal/predicate.js'

/**
 * Converts an iterable iterator to a generator.
 */

export function* toGenerator<T>(iterableIterator: IterableIterator<T>): Generator<T, void> {
  const iterator: Iterator<T> = iterableIterator[Symbol.iterator]();
  let result = iterator.next();
  while (!result.done) {
    yield result.value;
    result = iterator.next();
  }
}