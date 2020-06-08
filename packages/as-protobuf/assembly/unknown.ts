import { Box } from "./utils";

export enum UnknownValueType {
  Fixed32 = 0,
  Fixed64 = 1,
  Varint = 2,
  LengthDelimited = 3,
}

export class UnknownValue {
  private readonly _type: UnknownValueType;
  private readonly _u32: Box<u32> | null;
  private readonly _u64: Box<u64> | null;
  private readonly _bytes: Array<u8> | null;

  constructor(
    type: UnknownValueType,
    u32v: Box<u32> | null,
    u64v: Box<u64> | null,
    bytes: Array<u8> | null
  ) {
    this._type = type;
    this._u32 = u32v;
    this._u64 = u64v;
    this._bytes = bytes;
  }

  static fixed32(v: u32): UnknownValue {
    return new UnknownValue(UnknownValueType.Fixed32, new Box(v), null, null);
  }

  static fixed64(v: u64): UnknownValue {
    return new UnknownValue(UnknownValueType.Fixed64, null, new Box(v), null);
  }

  static varint(v: u64): UnknownValue {
    return new UnknownValue(UnknownValueType.Varint, null, new Box(v), null);
  }

  static lengthDelimited(v: u8[]): UnknownValue {
    return new UnknownValue(UnknownValueType.LengthDelimited, null, null, v);
  }

  type(): UnknownValueType {
    return this._type;
  }

  asU32(): u32 {
    assert(this._type == UnknownValueType.Fixed32);
    return this._u32!.inner;
  }

  asU64(): u64 {
    assert(this._type == UnknownValueType.Fixed64 || this._type == UnknownValueType.Varint);
    return this._u64!.inner;
  }

  asBytes(): u8[] {
    assert(this._type == UnknownValueType.LengthDelimited);
    return this._bytes!;
  }

  @operator("==")
  __eq(rhs: UnknownValue): bool {
    if (this.type() != rhs.type()) {
      return false;
    }

    switch (this.type()) {
      case UnknownValueType.Fixed32:
        return this.asU32() == rhs.asU32();
      case UnknownValueType.Fixed64:
        return this.asU64() == rhs.asU64();
      case UnknownValueType.Varint:
        return this.asU64() == rhs.asU64();
      case UnknownValueType.LengthDelimited:
        return this.asBytes() == rhs.asBytes();
      default:
        return false;
    }
  }
}
