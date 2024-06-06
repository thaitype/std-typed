import { Result, Std, String, Number } from "std-typed";

const turnIntoStringAndParse = (bytes: number[]): Result.Result<number, String.FromUtf8Error> =>
  Std.try(() => {
    const utf8String = String.String.fromUtf8(bytes).get();
    return Number.parseInt(utf8String.toString());
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