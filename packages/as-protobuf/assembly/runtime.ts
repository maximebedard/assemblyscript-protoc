import { WireType } from "./wire-format";

export function expectWireType(expected: WireType, actual: WireType): void {
  if (expected != actual) {
    throw new Error(`expected ${expected}, got ${actual}`);
  }
}

export function valueSize<T>(fieldNumber: u32, v: T, wireType: WireType): u32 {
  return 0;
}

export function valueVarintZigZagSize<T>(fieldNumber: u32, v: T): u32 {
  return 0;
}
