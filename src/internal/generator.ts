export class BaseGenerator<T = unknown, TReturn = any> implements Generator<T, TReturn, unknown> {
  private generator: Generator<T, TReturn, unknown>;

  constructor(generatorFunction: () => Generator<T, TReturn, unknown>) {
    this.generator = generatorFunction();
  }

  next(...args: [] | [unknown]): IteratorResult<T, TReturn> {
    const result = this.generator.next(...args);
    return result;
  }

  return(value?: any): IteratorResult<T, TReturn> {
    return this.generator.return(value);
  }

  throw(e?: any): IteratorResult<T, TReturn> {
    return this.generator.throw(e);
  }

  [Symbol.iterator](): Generator<T, TReturn, unknown> {
    return this;
  }
}

export class AggregatedGenerator<T = unknown, TReturn = any> extends BaseGenerator<T, TReturn> {
  count(): number {
    let count = 0;
    while (!this.next().done) {
      count++;
    }
    return count;
  }

  toArray(): T[] {
    const result: T[] = [];
    for (const value of this) {
      result.push(value);
    }
    return result;
  }

  toGenerator(): Generator<T, TReturn, unknown> {
    return this;
  }
}
