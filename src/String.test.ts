import { test, expect } from "bun:test";
import { String } from "./String.js";

test("String.from", () => {
  expect(String.from("Hello, ธาดา 😎").toString()).toBe("Hello, ธาดา 😎");
});

test("String.chars", () => {
  const chars = [];
  for (const char of String.from("Hello, ธาดา 😎").chars()) {
    chars.push(char);
  }
  expect(chars).toEqual(["H", "e", "l", "l", "o", ",", " ", "ธ", "า", "ด", "า", " ", "😎"]);
});

test("String.bytes", () => {
  const chars = [];
  for (const char of String.from("Hello, ธาดา 😎").bytes()) {
    chars.push(char);
  }
  expect(chars).toEqual([
    72, 101, 108, 108, 111, 44, 32, 224, 184, 152, 224, 184, 178, 224, 184, 148, 224, 184, 178, 32, 240, 159, 152, 142,
  ]);
});
