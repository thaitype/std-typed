import { Std, $Number } from "../src";

// TypeScript 1) Before using `get` method (Like ? operator in Rust)
const parseNumberAndLogStr = (
  str: string
): Std.Result<number, $Number.ParseIntError> =>
{
    const result = $Number.parseInt(str);
    const num = result.match({
      ok: (num) => {
        return num;
      },
      err: (err) => {
        return undefined;
      }
    });
    if(num === undefined) {
      return Std.err(result.error);
    }
    console.log(`Parsed number successfully: ${num}`);
    return Std.ok(num);
  }

// TypeScript 2) After using `get` method (Like ? operator in Rust)
const parseNumberAndLogStr2 = (
  str: string
): Std.Result<number, $Number.ParseIntError> =>
  Std.try(() => {
    const num = $Number.parseInt(str).get();
    console.log(`Parsed number successfully: ${num}`);
    return Std.ok(num);
  });

Std.runExit(async () => {
  const strVec = Std.vec(["", "0", "23,00", "40", "seven", "11111111111111111111111111"]);
  for (const item of strVec) {
    const num = parseNumberAndLogStr(item);
    console.log(`Result: ${num.toString()}`);
  }
});


//  ----- Rust Code below ------ 
// Note: Rust code is not executable, it's just for demonstration

// use std::num::ParseIntError;

// // Rust 1) Before using the ? operator
// fn parse_and_log_str(input: &str) -> Result<i32, ParseIntError> {
//     let result = input.parse::<i32>();
//     let num = match result {
//         Ok(num) => num,
//         Err(e) => return Err(e),
//     };
//     println!("Parsed number successfully: {}", num);
//     Ok(num)
// }

// // Rust 2) After using the ? operator
// fn parse_and_log_str2(input: &str) -> Result<i32, ParseIntError> {
//     let num = input.parse::<i32>()?;
//     println!("Parsed number successfully: {}", num);
//     Ok(num)
// }

// fn main(){
//     let str_vec = vec!["", "0", "23,00", "40", "seven", "11111111111111111111111111"];
//     for s in str_vec {
//         let parsed = parse_and_log_str(s);
//         println!("{:?}", parsed)
//     }
// }
