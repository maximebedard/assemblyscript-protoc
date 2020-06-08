import { Reader, WireType, UnknownValue } from "../";

describe("Reader", () => {
  it("readByte", () => {
    const reader = Reader.fromBytes([0x17]);
    expect<u8>(reader.readByte()).toBe(23);
    expect<bool>(reader.eof()).toBe(true);
  });

  it("readVarint32", () => {
    let reader = Reader.fromBytes([0x07]);
    expect<u32>(reader.readVarint32()).toBe(7);
    expect<bool>(reader.eof()).toBe(true);

    reader = Reader.fromBytes([0x96, 0x01]);
    expect<u32>(reader.readVarint32()).toBe(150);
    expect<bool>(reader.eof()).toBe(true);

    reader = Reader.fromBytes([0xFF, 0xFF, 0xFF, 0xFF, 0x0F]);
    expect<u32>(reader.readVarint32()).toBe(0xffffffff as u32);
    expect<bool>(reader.eof()).toBe(true);
  });

  it("readVarint64", () => {
    let reader = Reader.fromBytes([0x07]);
    expect<u64>(reader.readVarint64()).toBe(7);
    expect<bool>(reader.eof()).toBe(true);

    reader = Reader.fromBytes([0x96, 0x01]);
    expect<u64>(reader.readVarint64()).toBe(150);
    expect<bool>(reader.eof()).toBe(true);

    reader = Reader.fromBytes([0xFF, 0xFF, 0xFF, 0xFF, 0x0F]);
    expect<u64>(reader.readVarint64()).toBe(0xffffffff as u64);
    expect<bool>(reader.eof()).toBe(true);

    reader = Reader.fromBytes([0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x01]);
    expect<u64>(reader.readVarint64()).toBe(0xffffffffffffffff as u64);
    expect<bool>(reader.eof()).toBe(true);
  });

  itThrows("readVarint64 malformed", () => {
    let reader = Reader.fromBytes([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x01]);
    reader.readVarint64();
  });

  itThrows("readVarint64 unexpected eof", () => {
    let reader = Reader.fromBytes([0x96, 0x97])
    reader.readVarint64();
  });

  itThrows("readVarint32 malformed", () => {
    let reader = Reader.fromBytes([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x01]);
    reader.readVarint32();
  });

  itThrows("readVarint32 unexpected eof", () => {
    let reader = Reader.fromBytes([0x96, 0x97])
    reader.readVarint32();
  });

  it("readVarint32 pos", () => {
    let reader = Reader.fromBytes([0x95, 0x01, 0x98]);
    expect<u32>(reader.readVarint32()).toBe(149);
    expect<i32>(reader.pos()).toBe(2);
    expect<bool>(reader.eof()).toBe(false);
  });

  it("readInt32", () => {
    let reader = Reader.fromBytes([0x02]);
    expect<i32>(reader.readInt32()).toBe(2);
  });

  it("readFloat", () => {
    let reader = Reader.fromBytes([0x95, 0x73, 0x13, 0x61]);
    expect<f32>(reader.readFloat()).toBe(17e19);
  });

  it("readDouble", () => {
    let reader = Reader.fromBytes([0x40, 0xD5, 0xAB, 0x68, 0xB3, 0x07, 0x3D, 0x46]);
    expect<f64>(reader.readDouble()).toBe(23e29);
  });

  it("readBool", () => {
    let reader = Reader.fromBytes([]);
    expect<bool>(reader.readBool()).toBe(true);
  });

  it("readFixed32", () => {
    let reader = Reader.fromBytes([]);
    expect<u32>(reader.readFixed32()).toBe(1);
  });

  it("readFixed64", () => {
    let reader = Reader.fromBytes([]);
    expect<u64>(reader.readFixed64()).toBe(1);
  });

  it("readSint32", () => {
    let reader = Reader.fromBytes([]);
    expect<i32>(reader.readSint32()).toBe(1);
  });

  it("readSint64", () => {
    let reader = Reader.fromBytes([]);
    expect<i64>(reader.readSint64()).toBe(1);
  });

  it("readRepeatedPackedDouble", () => {
    let reader = Reader.fromBytes([]);
    expect<f64[]>(reader.readRepeatedPackedDouble()).toBe([1]);
  });

  it("readRepeatedPackedFloat", () => {
    let reader = Reader.fromBytes([]);
    expect<f32[]>(reader.readRepeatedPackedFloat()).toBe([1]);
  });

  it("readRepeatedPackedInt32", () => {
    let reader = Reader.fromBytes([]);
    expect<i32[]>(reader.readRepeatedPackedInt32()).toBe([1]);
  });

  it("readRepeatedPackedInt64", () => {
    let reader = Reader.fromBytes([]);
    expect<i64[]>(reader.readRepeatedPackedInt64()).toBe([1]);
  });

  it("readRepeatedPackedUint32", () => {
    let reader = Reader.fromBytes([]);
    expect<u32[]>(reader.readRepeatedPackedUint32()).toBe([1]);
  });

  it("readRepeatedPackedUint64", () => {
    let reader = Reader.fromBytes([]);
    expect<u64[]>(reader.readRepeatedPackedUint64()).toBe([1]);
  });

  it("readRepeatedPackedSint32", () => {
    let reader = Reader.fromBytes([]);
    expect<u32[]>(reader.readRepeatedPackedSint32()).toBe([1]);
  });

  it("readRepeatedPackedSint64", () => {
    let reader = Reader.fromBytes([]);
    expect<u64[]>(reader.readRepeatedPackedSint64()).toBe([1]);
  });

  it("readRepeatedPackedFixed32", () => {
    let reader = Reader.fromBytes([]);
    expect<u32[]>(reader.readRepeatedPackedFixed32()).toBe([1]);
  });

  it("readRepeatedPackedFixed64", () => {
    let reader = Reader.fromBytes([]);
    expect<u64[]>(reader.readRepeatedPackedFixed64()).toBe([1]);
  });

  it("readRepeatedPackedSfixed32", () => {
    let reader = Reader.fromBytes([]);
    expect<i32[]>(reader.readRepeatedPackedSfixed32()).toBe([1]);
  });

  it("readRepeatedPackedSfixed64", () => {
    let reader = Reader.fromBytes([]);
    expect<i64[]>(reader.readRepeatedPackedSfixed64()).toBe([1]);
  });

  it("readRepeatedPackedBool", () => {
    let reader = Reader.fromBytes([]);
    expect<bool[]>(reader.readRepeatedPackedBool()).toBe([1]);
  });

  it("readUnknown fixed32", () => {
    let reader = Reader.fromBytes([]);
    expect<UnknownValue>(reader.readUnknown(WireType.Fixed32))
      .toBe(UnknownValue.fixed32(1));
  });

  it("readUnknown fixed64", () => {
    let reader = Reader.fromBytes([]);
    expect<UnknownValue>(reader.readUnknown(WireType.Fixed64))
      .toBe(UnknownValue.fixed64(1));
  });

  it("readUnknown varint", () => {
    let reader = Reader.fromBytes([]);
    expect<UnknownValue>(reader.readUnknown(WireType.Varint))
      .toBe(UnknownValue.varint(1));
  });

  it("readUnknown length delimited", () => {
    let reader = Reader.fromBytes([]);
    expect<UnknownValue>(reader.readUnknown(WireType.LengthDelimited))
      .toBe(UnknownValue.lengthDelimited([0x01]));
  });

  it("readUnknown not supported", () => {
    let reader = Reader.fromBytes([]);
    expect<UnknownValue>(reader.readUnknown(WireType.StartGroup))
      .toBe(UnknownValue.lengthDelimited([0x01]));
  });
});
