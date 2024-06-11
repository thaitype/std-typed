import { Result, Std } from "std-typed";

Std.runExit(async () => {
  // Result.promise can catch error and return a Result object.
  const result = await Result.promise(() => Promise.reject({ data: "Hello World" }));
  console.log(`${JSON.stringify(result)}`);

  console.log(`\nTry to catch error...`);
  // Result.promise can custom error message.
  const result2 = await Result.promise({
    try: () => {
      const random = Math.random();
      if (random > 0.5) {
        return Promise.reject("You are unlucky!");
      } else {
        return Promise.resolve("You are lucky!");
      }
    },
    catch: (error: unknown) => `Custom Error: ${error}`
  });

  console.log(`${JSON.stringify(result2)}`);
});
