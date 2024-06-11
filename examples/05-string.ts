import { Std, StdString } from "std-typed";

Std.runExit(async () => {
  const string = "Hello, ธาดา 😎";
  // const string = "B";
  console.log(`Count of bytes: ${StdString.from(string).chars().count()}`);
  console.log(`CharNumber: ${StdString.from(string).chars().toArray()}`);
});
