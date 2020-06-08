import { Reader, Writer, WireType } from "../";
import * as Rt from "../runtime";

class MyType {
  // TODO: bytes
  // TODO: string
  // TODO: enum, nested enum, foreign enum
  // TODO: message, nested message, foreign message

  // singular fields
  sI32: i32;
  sI64: i64;
  sU32: u32;
  sU64: u64;
  sSint32: i32;
  sSint64: i64;
  sFixed32: u32;
  sFixed64: u64;
  sSfixed32: i32;
  sSfixed64: i64;
  sFloat: f32;
  sDouble: f64;
  sBool: bool;
  sString: string;
  sBytes: Array<u8>;

  // repeated fields
  rI32: Array<i32>;
  rI64: Array<i64>;
  rU32: Array<u32>;
  rU64: Array<u64>;
  rSint32: Array<i32>;
  rSint64: Array<i64>;
  rFixed32: Array<u32>;
  rFixed64: Array<u64>;
  rSfixed32: Array<i32>;
  rSfixed64: Array<i64>;
  rFloat: Array<f32>;
  rDouble: Array<f64>;
  rBool: Array<bool>;
  rString: Array<string>;
  rBytes: Array<Array<u8>>;

  // TODO: generate theses from well_know_types wrappers.
  // private readonly _nullableU32: Box<u32> | null;
  // private readonly _nullableU64: Box<u64> | null;
  // private readonly _nullableI32: Box<i32> | null;
  // private readonly _nullableI64: Box<i64> | null;
  // private readonly _nullableSint32: Box<i32> | null;
  // private readonly _nullableSint64: Box<i64> | null;
  // private readonly _nullableFixed32: Box<u32> | null;
  // private readonly _nullableFixed64: Box<u64> | null;
  // private readonly _nullableSfixed32: Box<i32> | null;
  // private readonly _nullableSfixed64: Box<i64> | null;
  // private readonly _nullableFloat: Box<f32> | null;
  // private readonly _nullableDouble: Box<f64> | null;
  // private readonly _nullableBool: Box<bool> | null;

  computeSizeProto(): u32 {
    let size = 0;

    // singular fields
    if (this.sI32 != 0) size += Rt.valueSize<i32>(1, this.sI32, WireType.Varint);
    if (this.sI64 != 0) size += Rt.valueSize<i64>(2, this.sI64, WireType.Varint);
    if (this.sU32 != 0) size += Rt.valueSize<u32>(3, this.sU32, WireType.Varint);
    if (this.sU64 != 0) size += Rt.valueSize<u64>(4, this.sU64, WireType.Varint);
    if (this.sSint32 != 0) size += Rt.valueVarintZigZagSize<i32>(5, this.sSint32);
    if (this.sSint64 != 0) size += Rt.valueVarintZigZagSize<i64>(6, this.sSint64);
    if (this.sFixed32 != 0) size += 5;
    if (this.sFixed64 != 0) size += 9;
    if (this.sSfixed32 != 0) size += 5;
    if (this.sSfixed64 != 0) size += 9;
    if (this.sFloat != 0.) size += 5;
    if (this.sDouble != 0.) size += 9;
    if (!this.sBool) size += 2;

    // repeated fields
    for (let i = 0; i < this.rI32.length; i += 1) {
      size += Rt.valueSize(13, this.rI32[i], WireType.Varint);
    }
    for (let i = 0; i < this.rI64.length; i += 1) {
      size += Rt.valueSize(14, this.rI64[i], WireType.Varint);
    }
    for (let i = 0; i < this.rU32.length; i += 1) {
      size += Rt.valueSize(15, this.rU32[i], WireType.Varint);
    }
    for (let i = 0; i < this.rU64.length; i += 1) {
      size += Rt.valueSize(16, this.rU64[i], WireType.Varint);
    }
    for (let i = 0; i < this.rSint32.length; i += 1) {
      size += Rt.valueVarintZigZagSize(17, this.rSint32[i]);
    }
    for (let i = 0; i < this.rSint64.length; i += 1) {
      size += Rt.valueVarintZigZagSize(18, this.rSint64[i]);
    }
    size += 6 * this.rFixed32.length;
    size += 10 * this.rFixed64.length;
    size += 6 * this.rSfixed32.length;
    size += 10 * this.rSfixed64.length;
    size += 6 * this.rFloat.length;
    size += 10 * this.rDouble.length;
    size += 3 * this.rBool.length;

    return size;
  }

  toProto(w: Writer): void {
    // singular fields
    if (this.sI32 != 0) w.writeInt32Field(1, this.sI32);
    if (this.sI64 != 0) w.writeInt64Field(2, this.sI64);
    if (this.sU32 != 0) w.writeUint32Field(3, this.sU32);
    if (this.sU64 != 0) w.writeUint64Field(4, this.sU64);
    if (this.sSint32 != 0) w.writeSint32Field(5, this.sSint32);
    if (this.sSint64 != 0) w.writeSint64Field(6, this.sSint64);
    if (this.sFixed32 != 0) w.writeFixed32Field(7, this.sFixed32);
    if (this.sFixed64 != 0) w.writeFixed64Field(8, this.sFixed64);
    if (this.sSfixed32 != 0) w.writeSfixed32Field(9, this.sSfixed32);
    if (this.sSfixed64 != 0) w.writeSfixed64Field(10, this.sSfixed64);
    if (this.sFloat != 0.) w.writeFloatField(11, this.sFloat);
    if (this.sDouble != 0.) w.writeDoubleField(12, this.sDouble);
    if (!this.sBool)  w.writeBoolField(13, this.sBool);
    if (this.sString.length > 0) w.writeStringField(15, this.sString);
    if (this.sBytes.length > 0) w.writeBytesField(14, this.sBytes);

    // repeated fields
    for (let i = 0; i < this.rI32.length; i += 1) {
      w.writeInt32Field(16, this.rI32[i]);
    }
    for (let i = 0; i < this.rI64.length; i += 1) {
      w.writeInt64Field(17, this.rI64[i]);
    }
    for (let i = 0; i < this.rU32.length; i += 1) {
      w.writeUint32Field(18, this.rU32[i]);
    }
    for (let i = 0; i < this.rU64.length; i += 1) {
      w.writeUint64Field(19, this.rU64[i]);
    }
    for (let i = 0; i < this.rSint32.length; i += 1) {
      w.writeSint32Field(20, this.rSint32[i]);
    }
    for (let i = 0; i < this.rSint64.length; i += 1) {
      w.writeSint64Field(21, this.rSint64[i]);
    }
    for (let i = 0; i < this.rFixed32.length; i += 1) {
      w.writeFixed32Field(22, this.rFixed32[i]);
    }
    for (let i = 0; i < this.rFixed64.length; i += 1) {
      w.writeFixed64Field(23, this.rFixed64[i]);
    }
    for (let i = 0; i < this.rSfixed32.length; i += 1) {
      w.writeSfixed32Field(24, this.rSfixed32[i]);
    }
    for (let i = 0; i < this.rSfixed64.length; i += 1) {
      w.writeSfixed64Field(25, this.rSfixed64[i]);
    }
    for (let i = 0; i < this.rFloat.length; i += 1) {
      w.writeFloatField(26, this.rFloat[i]);
    }
    for (let i = 0; i < this.rDouble.length; i += 1) {
      w.writeDoubleField(27, this.rDouble[i]);
    }
    for (let i = 0; i < this.rBool.length; i += 1) {
      w.writeBoolField(28, this.rBool[i]);
    }
  }

  mergeFromProto(r: Reader): void {
    while(!r.eof()) {
      const tag = r.readTag();
      switch (tag.fieldNumber) {
        case 1:
          Rt.expectWireType(tag.wireType, WireType.Varint);
          this.sI32 = r.readInt32();
          break;
        case 2:
          Rt.expectWireType(tag.wireType, WireType.Varint);
          this.sI64 = r.readInt64();
          break;
        case 3:
          Rt.expectWireType(tag.wireType, WireType.Varint);
          this.sU32 = r.readUint32();
          break;
        case 4:
          Rt.expectWireType(tag.wireType, WireType.Varint);
          this.sU64 = r.readUint64();
          break;
        case 5:
          Rt.expectWireType(tag.wireType, WireType.Varint);
          this.sSint32 = r.readSint32();
          break;
        case 6:
          Rt.expectWireType(tag.wireType, WireType.Varint);
          this.sSint64 = r.readSint64();
          break;
        case 7:
          Rt.expectWireType(tag.wireType, WireType.Fixed32);
          this.sFixed32 = r.readFixed32();
          break;
        case 8:
          Rt.expectWireType(tag.wireType, WireType.Fixed64);
          this.sFixed64 = r.readFixed64();
          break;
        case 9:
          Rt.expectWireType(tag.wireType, WireType.Fixed32);
          this.sSfixed32 = r.readSfixed32();
          break;
        case 10:
          Rt.expectWireType(tag.wireType, WireType.Fixed64);
          this.sSfixed64 = r.readSfixed64();
          break;
        case 11:
          Rt.expectWireType(tag.wireType, WireType.Fixed32);
          this.sFloat = r.readFloat();
          break;
        case 12:
          Rt.expectWireType(tag.wireType, WireType.Fixed64);
          this.sDouble = r.readDouble();
          break;
        case 13:
          Rt.expectWireType(tag.wireType, WireType.Varint);
          this.sBool = r.readBool();
          break;
      }
    }
  }

  @operator("==")
  __eq(rhs: MyType): bool {
    return false;
  }
}

describe("Integration", () => {
  it("roundtrip is stable", () => {
    const a = new MyType();
    const size = a.computeSizeProto();

    const buffer = new Array<u8>(size);
    const writer = new Writer(buffer);
    a.toProto(writer);

    const b = new MyType();
    const reader = Reader.fromBytes(buffer);
    b.mergeFromProto(reader);

    expect<MyType>(b).toBe(a);
  })
})
