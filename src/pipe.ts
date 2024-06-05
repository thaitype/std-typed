// -------------- Pipe Function --------------

type AnyFunc = (...arg: any) => any;

type LastFnReturnType<F extends Array<AnyFunc>, Else = never> = F extends [...any[], (...arg: any) => infer R]
  ? R
  : Else;

type PipeArgs<F extends AnyFunc[], Acc extends AnyFunc[] = []> = F extends [(...args: infer A) => infer B]
  ? [...Acc, (...args: A) => B]
  : F extends [(...args: infer A) => any, ...infer Tail]
  ? Tail extends [(arg: infer B) => any, ...any[]]
    ? PipeArgs<Tail, [...Acc, (...args: A) => B]>
    : Acc
  : Acc;

/**
 * Pipe a value through a sequence of functions
 * 
 * @deprecated Pipe function might not be an Objective of this project, there're many libs implement this function, such as Effect.
 * 
 * @example
 * ```ts
  * const valid = pipe(
    "323",
    (a: string) => Number(a),
    (b: number) => b + 1,
    (d: number) => `${d}`,
    (e: string) => Number(e)
  ); // 324
  ```
 *
 * @ref https://dev.to/ecyrbe/how-to-use-advanced-typescript-to-define-a-pipe-function-381h
 */
export function pipe<FirstFn extends AnyFunc, F extends AnyFunc[]>(
  arg: Parameters<FirstFn>[0],
  firstFn: FirstFn,
  ...fns: PipeArgs<F> extends F ? F : PipeArgs<F>
): LastFnReturnType<F, ReturnType<FirstFn>> {
  return (fns as AnyFunc[]).reduce((acc, fn) => fn(acc), firstFn(arg));
}


// --------------------------------