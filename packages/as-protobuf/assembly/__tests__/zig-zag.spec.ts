import {
  decodeZigZag64,
  decodeZigZag32,
  encodeZigZag64,
  encodeZigZag32,
} from "../zig-zag";

function testZigZagPair64(decoded: i64, encoded: u64): void {
  expect<i64>(decoded).toBe(decodeZigZag64(encoded));
  expect<u64>(encoded).toBe(encodeZigZag64(decoded));
}

function testZigZagPair32(decoded: i32, encoded: u32): void {
  expect<i32>(decoded).toBe(decodeZigZag32(encoded));
  expect<u32>(encoded).toBe(encodeZigZag32(decoded));
  testZigZagPair64(decoded as i64, encoded as u64);
}

describe("ZigZag", () => {
  it("encodes and decodes successfully", () => {
    testZigZagPair32(0, 0);
    testZigZagPair32(-1, 1);
    testZigZagPair32(1, 2);
    testZigZagPair32(-2, 3);
    testZigZagPair32(2147483647, 4294967294);
    testZigZagPair32(-2147483648, 4294967295);
    testZigZagPair64(9223372036854775807, 18446744073709551614);
    testZigZagPair64(-9223372036854775808, 18446744073709551615);
  });
});
