import { Result, Std, StdString, StdNumber } from "std-typed";

const turnIntoStringAndParse = (bytes: number[]) =>
  Result.func<number, StdString.FromUtf8Error | StdNumber.ParseIntError>(() => {
    const utf8String = StdString.fromUtf8(bytes).unwrapOrThrow();
    const num = StdNumber.parseInt(utf8String.toString()).unwrapOrThrow();
    return Result.ok(num);
  });

Std.runExit(() => {
  const bytesVec = [
    [],
    [191],
    [240, 159, 146, 150], // Heart blinking emoji in UTF-8
    [48, 49, 50],
    [48, 49, 50, 51, 52],
  ];
  for (const bytes of bytesVec) {
    const parsed = turnIntoStringAndParse(bytes);
    console.log(`${parsed}`);
  }
});

// ------ Rust Code ------
// use std::error::Error;

// fn turn_into_string_and_parse(bytes: Vec<u8>) -> Result<i32, Box<dyn Error>> {
//   let num = String::from_utf8(bytes)?.parse::<i32>()?;
//   Ok(num)
// }

// fn main() {
//   let bytes_vec = vec![vec![], vec![191], vec![240, 159, 146, 150], vec![48, 49, 50], vec![48, 49, 50, 51, 52],];
//   for bytes in bytes_vec {
//       let parsed = turn_into_string_and_parse(bytes);
//       println!("{:?}", parsed);
//   }
// }

// Output

// Err(ParseIntError { kind: Empty })
// Err(FromUtf8Error { bytes: [191], error: Utf8Error { valid_up_to: 0, error_len: Some(1) } })
// Err(ParseIntError { kind: InvalidDigit })
// Ok(12)
// Ok(1234)
