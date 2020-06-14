export function decodeZigZag64(v: u64): i64 {
  return ((v >> 1) as i64) ^ (-((v & 1) as i64));
}

export function decodeZigZag32(v: u32): i32 {
  return ((v >> 1) as i32) ^ (-((v & 1) as i32));
}

export function encodeZigZag32(v: i32): u32 {
  return ((v << 1) ^ (v >> 31)) as u32;
}

export function encodeZigZag64(v: i64): u64 {
  return ((v << 1) ^ (v >> 63)) as u64;
}

