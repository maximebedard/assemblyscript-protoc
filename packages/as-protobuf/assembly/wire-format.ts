export const TAG_TYPE_BITS: u32 = 3;
export const TAG_TYPE_MASK: u32 = (1 << TAG_TYPE_BITS) - 1;
export const FIELD_NUMBER_MAX: u32 = 0x1FFFFFFF;

export enum WireType {
  Varint = 0,
  Fixed64 = 1,
  LengthDelimited = 2,
  StartGroup = 3, // Not supported.
  EndGroup = 4, // Not supported.
  Fixed32 = 5,
}

export function tryWireTypeFromU32(v: u32): WireType {
  assert(v <= 5, "Invalid wire type.");
  assert(v != 3, "StartGroup type is not supported.");
  assert(v != 4, "EndGroup type is not supported.");
  return v as WireType;
}

export class Tag {
  private readonly _fieldNumber: u32;
  private readonly _wireType : WireType;

  constructor(fieldNumber: u32, wireType: WireType) {
    assert(fieldNumber > 0 && fieldNumber <= FIELD_NUMBER_MAX, "Invalid fieldNumber.");
    this._fieldNumber = fieldNumber;
    this._wireType = wireType;
  }

  static fixed32(fieldNumber: u32): Tag {
    return new Tag(fieldNumber, WireType.Fixed32);
  }

  static fixed64(fieldNumber: u32): Tag {
    return new Tag(fieldNumber, WireType.Fixed64);
  }

  static varint(fieldNumber: u32): Tag {
    return new Tag(fieldNumber, WireType.Varint);
  }

  static lengthDelimited(fieldNumber: u32): Tag {
    return new Tag(fieldNumber, WireType.LengthDelimited);
  }

  static tryFromU32(v: u32): Tag {
    let wireType = tryWireTypeFromU32(v & TAG_TYPE_MASK);
    let fieldNumber = v >> TAG_TYPE_BITS;
    return new Tag(fieldNumber, wireType);
  }

  asU32(): u32 {
    return (this.fieldNumber << TAG_TYPE_BITS) | (this.wireType as u32);
  }

  get fieldNumber(): u32 { return this._fieldNumber; }
  get wireType(): WireType { return this._wireType; }

  @operator("==")
  __eq(rhs: Tag): bool {
    return this.asU32() == rhs.asU32();
  }
}
