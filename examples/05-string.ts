import { Std, String } from "std-typed";

Std.runExit(async () => {
  const string = "Hello, ธาดา 😎";
  // const string = "B";
  console.log(`Count of bytes: ${String.from(string).bytes().count()}`);
  const chars = [];
  for (const char of String.from(string).bytes()) {
    chars.push(char);
  }
  console.log(`CharNumber: ${chars.join(", ")}`);

  console.log(string.split("").map((char) => char.charCodeAt(0)));
});
