import { Result, Std } from "std-typed";

/**
 * https://www.npmjs.com/package/p-retry
 * https://2024-effect-days-keynote.vercel.app/8
 * https://youtu.be/PxIBWjiv3og
 */
type GetTodoError = "Failed to fetch todo";

const getTodo = (id: number) =>
  Result.funcAsync<number, GetTodoError>(async c => {
    const result = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${id}`
    );
    if (!result.ok) return c.err("Failed to fetch todo");
    const json = await result.json();
    return c.ok(json);
  });
/**
 * Delay for a specified amount of time
 * @param ms value in milliseconds
 * @returns Promise of void
 */
export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

Std.runExit(async () => {
  for (const id of [-1, 1]) {
    const result = await getTodo(id);
    console.log(`Fetch Result (id="${id}"): => ${result}`);
  }
});
