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
  assert(v <= 5);
  return v as WireType;
}

export class Tag {
  private readonly _fieldNumber: u32;
  private readonly _wireType : WireType;

  constructor(fieldNumber: u32, wireType: WireType) {
    assert(fieldNumber > 0 && fieldNumber <= FIELD_NUMBER_MAX);
    this._fieldNumber = fieldNumber;
    this._wireType = wireType;
  }

  static tryFromU32(v: u32): Tag {
    let wireType = tryWireTypeFromU32(value & TAG_TYPE_MASK);
    let fieldNumber = value >> TAG_TYPE_BITS;
    return new Tag(fieldNumber, wireType);
  }

  get fieldNumber(): u32 { return this._fieldNumber; }
  get wireType(): WireType { return this._wireType; }
}
