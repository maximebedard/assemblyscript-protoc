import { InputStream, Reader, WireType, UnknownValue } from "../";

function expectBytesReadExact<T>(bytes: Array<u8>, expected: T, actual: (is: InputStream) => T): void {
  const is = InputStream.fromBytes(bytes);
  expect<T>(actual(is)).toBe(expected);
  expect<bool>(is.eof()).toBe(true);
}

function expectBytesReadPartial<T>(bytes: Array<u8>, expected: T, expectedPos: i32, actual: (is: InputStream) => T): void {
  const is = InputStream.fromBytes(bytes);
  expect<T>(actual(is)).toBe(expected);
  expect<bool>(is.eof()).toBe(false);
  expect<u32>(is.pos()).toBe(expectedPos);
}

describe("InputStream", () => {
  it("readByte", () => {
    const reader = (is: InputStream): u8 => is.readByte();
    expectBytesReadExact<u8>([0x17], 23, reader);
  });

  it("readVarint32", () => {
    const reader = (is: InputStream): u32 => is.readVarint32();
    expectBytesReadExact<u32>([0x07], 7, reader);
    expectBytesReadExact<u32>([0x96, 0x01], 150, reader);
    expectBytesReadExact<u32>([0xFF, 0xFF, 0xFF, 0xFF, 0x0F], 0xffffffff as u32, reader);
  });

  it("readVarint64", () => {
    const reader = (is: InputStream): u64 => is.readVarint64();
    expectBytesReadExact<u64>([0x07], 7, reader);
    expectBytesReadExact<u64>([0x96, 0x01], 150, reader);
    expectBytesReadExact<u64>([0xFF, 0xFF, 0xFF, 0xFF, 0x0F], 0xffffffff as u32, reader);
    expectBytesReadExact<u64>([0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x01], 0xffffffffffffffff as u64, reader);
  });

  itThrows("readVarint64 malformed", () => {
    InputStream.fromBytes([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x01])
      .readVarint64();
  });

  itThrows("readVarint64 unexpected eof", () => {
    InputStream.fromBytes([0x96, 0x97])
      .readVarint64();
  });

  itThrows("readVarint32 malformed", () => {
    InputStream.fromBytes([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x01])
      .readVarint32();
  });

  itThrows("readVarint32 unexpected eof", () => {
    InputStream.fromBytes([0x96, 0x97])
      .readVarint32();
  });

  it("readVarint32 pos", () => {
    let reader = (is: InputStream): i32 => is.readVarint32();
    expectBytesReadPartial<u32>([0x95, 0x01, 0x98], 149, 2, reader);
  });

  it("readInt32", () => {
    let reader = (is: InputStream): i32 => is.readInt32();
    expectBytesReadExact<i32>([0x02], 2, reader);
  });

  it("readFloat", () => {
    let reader = (is: InputStream): f32 => is.readFloat();
    expectBytesReadExact<f32>([0x95, 0x73, 0x13, 0x61], 17e19, reader);
  });

  it("readDouble", () => {
    let reader = (is: InputStream): f64 => is.readDouble();
    expectBytesReadExact<f64>([0x40, 0xD5, 0xAB, 0x68, 0xB3, 0x07, 0x3D, 0x46], 23e29, reader);
  });

  xit("readBool", () => {
    let reader = (is: InputStream): bool => is.readBool();
    expectBytesReadExact<bool>([], true, reader);
    expectBytesReadExact<bool>([], false, reader);
  });

  xit("readFixed32", () => {
    let reader = (is: InputStream): u32 => is.readFixed32();
    expectBytesReadExact<u32>([], 1337, reader);
  });

  xit("readFixed64", () => {
    let reader = (is: InputStream): u64 => is.readFixed64();
    expectBytesReadExact<u64>([], 1337, reader);
  });

  xit("readSint32", () => {
    let reader = (is: InputStream): i32 => is.readSint32();
    expectBytesReadExact<i32>([], 1337, reader);
  });

  xit("readSint64", () => {
    let reader = (is: InputStream): i64 => is.readSint32();
    expectBytesReadExact<i64>([], 1337, reader);
  });

  xit("readRepeatedDoubleInto", () => {
    let actual = new Array<f64>();
    let is = InputStream.fromBytes([]);
    is.readRepeatedDoubleInto(actual);
    expect<f64[]>(actual).toBe([1]);
  });

  xit("readRepeatedFloatInto", () => {
    let actual = new Array<f32>();
    let is = InputStream.fromBytes([]);
    is.readRepeatedFloatInto(actual);
    expect<f32[]>(actual).toBe([1]);
  });

  xit("readRepeatedInt32Into", () => {
    let actual = new Array<i32>();
    let is = InputStream.fromBytes([]);
    is.readRepeatedInt32Into(actual);
    expect<i32[]>(actual).toBe([1]);
  });

  xit("readRepeatedInt64Into", () => {
    let actual = new Array<i64>();
    let is = InputStream.fromBytes([]);
    is.readRepeatedInt64Into(actual);
    expect<i64[]>(actual).toBe([1]);
  });

  xit("readRepeatedUint32Into", () => {
    let actual = new Array<u32>();
    let is = InputStream.fromBytes([]);
    is.readRepeatedUint32Into(actual);
    expect<u32[]>(actual).toBe([1]);
  });

  xit("readRepeatedUint64Into", () => {
    let actual = new Array<u64>();
    let is = InputStream.fromBytes([]);
    is.readRepeatedUint64Into(actual);
    expect<u64[]>(actual).toBe([1]);
  });

  xit("readRepeatedSint32Into", () => {
    let actual = new Array<i32>();
    let is = InputStream.fromBytes([]);
    is.readRepeatedSint32Into(actual);
    expect<i32[]>(actual).toBe([1]);
  });

  xit("readRepeatedSint64Into", () => {
    let actual = new Array<i64>();
    let is = InputStream.fromBytes([]);
    is.readRepeatedSint64Into(actual);
    expect<i64[]>(actual).toBe([1]);
  });

  xit("readRepeatedFixed32Into", () => {
    let actual = new Array<u32>();
    let is = InputStream.fromBytes([]);
    is.readRepeatedFixed32Into(actual);
    expect<u32[]>(actual).toBe([1]);
  });

  xit("readRepeatedFixed64Into", () => {
    let actual = new Array<u64>();
    let is = InputStream.fromBytes([]);
    is.readRepeatedFixed64Into(actual);
    expect<u64[]>(actual).toBe([1]);
  });

  xit("readRepeatedSfixed32Into", () => {
    let actual = new Array<i32>();
    let is = InputStream.fromBytes([]);
    is.readRepeatedSfixed32Into(actual);
    expect<i32[]>(actual).toBe([1]);
  });

  xit("readRepeatedSfixed64Into", () => {
    let actual = new Array<i64>();
    let is = InputStream.fromBytes([]);
    is.readRepeatedSfixed64Into(actual);
    expect<i64[]>(actual).toBe([1]);
  });

  xit("readRepeatedBoolInto", () => {
    let actual = new Array<bool>();
    let is = InputStream.fromBytes([]);
    is.readRepeatedBoolInto(actual);
    expect<bool[]>(actual).toBe([1]);
  });
});

describe("Reader", () => {
  // xit("readUnknown fixed32", () => {
  //   let is = InputStream.fromBytes([]);
  //   expect<UnknownValue>(is.readUnknown(WireType.Fixed32))
  //     .toBe(UnknownValue.fixed32(1));
  // });

  // xit("readUnknown fixed64", () => {
  //   let is = InputStream.fromBytes([]);
  //   expect<UnknownValue>(is.readUnknown(WireType.Fixed64))
  //     .toBe(UnknownValue.fixed64(1));
  // });

  // xit("readUnknown varint", () => {
  //   let is = InputStream.fromBytes([]);
  //   expect<UnknownValue>(is.readUnknown(WireType.Varint))
  //     .toBe(UnknownValue.varint(1));
  // });

  // xit("readUnknown length delimited", () => {
  //   let is = InputStream.fromBytes([]);
  //   expect<UnknownValue>(is.readUnknown(WireType.LengthDelimited))
  //     .toBe(UnknownValue.lengthDelimited([0x01]));
  // });

  // xit("readUnknown not supported", () => {
  //   let is = InputStream.fromBytes([]);
  //   expect<UnknownValue>(is.readUnknown(WireType.StartGroup))
  //     .toBe(UnknownValue.lengthDelimited([0x01]));
  // });
});
