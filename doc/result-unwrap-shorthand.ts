import { Result, Std, StdArray, StdNumber } from "std-typed";

/**
 * To gain a better understanding, let's look at Points 1 and 3 of Rust. You'll see that Rust's code is reduced from 7 lines to 3.
 *
 * If you look at Rust's code (Point 1), you'll see that Rust internally uses `match` to make the code significantly shorter.
 *
 * So, I thought to myself, "Wow, the `?` operator is quite tricky. It does a lot of things for us behind the scenes."
 *
 * Since we wanted to understand how the `?` operator works, we tried writing it in TypeScript. We started to get that
 * if we want to transform it into TypeScript and make the type guard correct, we need to force it to throw first (line 21)
 * and then use try-catch to catch it (line 20) to prevent the error from escaping. This way, we also get the error object from the result.
 *
 * Refer explanation (Thai Version) in https://www.facebook.com/photo.php?fbid=961075926022069&set=a.486562490140084&type=3&notif_id=1717545799094703&notif_t=feedback_reaction_generic&ref=notif
 */

// TypeScript 1) Before using `get` method (Like ? operator in Rust)
const parseNumberAndLogStr = (str: string): Result.Result<number, StdNumber.ParseIntError> => {
  const result = StdNumber.parseInt(str);
  const num = result.match({
    ok: (num) => num,
    err: (err) => undefined
  });
  if (num === undefined) {
    if (result.isErr()) return Result.err(result.unwrap());
    return Result.err(new StdNumber.ParseIntError("Zero"));
  }
  console.log(`Parsed number successfully: ${num}`);
  return Result.ok(num);
};

// TypeScript 2) After using `get` method (Like ? operator in Rust)
const parseNumberAndLogStr2 = (str: string): Result.Result<number, StdNumber.ParseIntError> =>
  Result.func<number, StdNumber.ParseIntError>(() => {
    const num = StdNumber.parseInt(str).unwrapOrThrow();
    console.log(`Parsed number successfully: ${num}`);
    return Result.ok(num);
  });

Std.runExit(async () => {
  const strVec = StdArray.from(["", "0", "23,00", "40", "seven", "11111111111111111111111111"]);
  for (const item of strVec) {
    const num = parseNumberAndLogStr2(item);
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
