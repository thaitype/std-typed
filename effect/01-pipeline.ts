import { Effect } from "effect"
 
const increment = (x: number) => x + 1
 
const divide = (a: number, b: number): Effect.Effect<number, Error> =>
  b === 0
    ? Effect.fail(new Error("Cannot divide by zero"))
    : Effect.succeed(a / b)
 
const task1 = Effect.promise(() => Promise.resolve(10))
 
const task2 = Effect.promise(() => Promise.resolve(2))
 
const program = Effect.all([task1, task2]).pipe(
  Effect.andThen(([a, b]) => divide(a, b)),
  Effect.andThen((n1) => increment(n1)),
  Effect.andThen((n2) => `Result is: ${n2}`)
)
 
Effect.runPromise(program).then(console.log) // Output: "Result is: 6"