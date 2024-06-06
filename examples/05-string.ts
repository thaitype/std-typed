import { Std, String } from "std-typed";

Std.runExit(async () => {
  const string = "Hello, ธาดา 😎";
  // const string = "B";
  console.log(`Count of bytes: ${String.from(string).chars().count()}`);
  console.log(`CharNumber: ${ String.from(string).chars().toArray()}`);
});
