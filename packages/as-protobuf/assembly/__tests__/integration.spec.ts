import { InputStream, OutputStream, Reader, Writer, WireType } from "../";
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

    return size + Rt.computeVarint32Size(size);
  }

  toProto(w: Writer): void {
    this.computeSizeProto();
    // singular fields
    if (this.sI32 != 0) w.writeInt32(1, this.sI32);
    if (this.sI64 != 0) w.writeInt64(2, this.sI64);
    if (this.sU32 != 0) w.writeUint32(3, this.sU32);
    if (this.sU64 != 0) w.writeUint64(4, this.sU64);
    if (this.sSint32 != 0) w.writeSint32(5, this.sSint32);
    if (this.sSint64 != 0) w.writeSint64(6, this.sSint64);
    if (this.sFixed32 != 0) w.writeFixed32(7, this.sFixed32);
    if (this.sFixed64 != 0) w.writeFixed64(8, this.sFixed64);
    if (this.sSfixed32 != 0) w.writeSfixed32(9, this.sSfixed32);
    if (this.sSfixed64 != 0) w.writeSfixed64(10, this.sSfixed64);
    if (this.sFloat != 0.) w.writeFloat(11, this.sFloat);
    if (this.sDouble != 0.) w.writeDouble(12, this.sDouble);
    if (!this.sBool)  w.writeBool(13, this.sBool);
    if (this.sString.length > 0) w.writeString(15, this.sString);
    if (this.sBytes.length > 0) w.writeBytes(14, this.sBytes);

    // repeated fields
    for (let i = 0; i < this.rI32.length; i += 1) {
      w.writeInt32(16, this.rI32[i]);
    }
    for (let i = 0; i < this.rI64.length; i += 1) {
      w.writeInt64(17, this.rI64[i]);
    }
    for (let i = 0; i < this.rU32.length; i += 1) {
      w.writeUint32(18, this.rU32[i]);
    }
    for (let i = 0; i < this.rU64.length; i += 1) {
      w.writeUint64(19, this.rU64[i]);
    }
    for (let i = 0; i < this.rSint32.length; i += 1) {
      w.writeSint32(20, this.rSint32[i]);
    }
    for (let i = 0; i < this.rSint64.length; i += 1) {
      w.writeSint64(21, this.rSint64[i]);
    }
    for (let i = 0; i < this.rFixed32.length; i += 1) {
      w.writeFixed32(22, this.rFixed32[i]);
    }
    for (let i = 0; i < this.rFixed64.length; i += 1) {
      w.writeFixed64(23, this.rFixed64[i]);
    }
    for (let i = 0; i < this.rSfixed32.length; i += 1) {
      w.writeSfixed32(24, this.rSfixed32[i]);
    }
    for (let i = 0; i < this.rSfixed64.length; i += 1) {
      w.writeSfixed64(25, this.rSfixed64[i]);
    }
    for (let i = 0; i < this.rFloat.length; i += 1) {
      w.writeFloat(26, this.rFloat[i]);
    }
    for (let i = 0; i < this.rDouble.length; i += 1) {
      w.writeDouble(27, this.rDouble[i]);
    }
    for (let i = 0; i < this.rBool.length; i += 1) {
      w.writeBool(28, this.rBool[i]);
    }
  }

  mergeFromProto(r: Reader): void {
    while(!r.eof()) {
      const tag = r.readTag();
      switch (tag.fieldNumber) {
        case 1:
          this.sI32 = r.readInt32(tag.wireType);
          break;
        case 2:
          this.sI64 = r.readInt64(tag.wireType);
          break;
        case 3:
          this.sU32 = r.readUint32(tag.wireType);
          break;
        case 4:
          this.sU64 = r.readUint64(tag.wireType);
          break;
        case 5:
          this.sSint32 = r.readSint32(tag.wireType);
          break;
        case 6:
          this.sSint64 = r.readSint64(tag.wireType);
          break;
        case 7:
          this.sFixed32 = r.readFixed32(tag.wireType);
          break;
        case 8:
          this.sFixed64 = r.readFixed64(tag.wireType);
          break;
        case 9:
          this.sSfixed32 = r.readSfixed32(tag.wireType);
          break;
        case 10:
          this.sSfixed64 = r.readSfixed64(tag.wireType);
          break;
        case 11:
          this.sFloat = r.readFloat(tag.wireType);
          break;
        case 12:
          this.sDouble = r.readDouble(tag.wireType);
          break;
        case 13:
          this.sBool = r.readBool(tag.wireType);
          break;
        case 14:
          this.sString = r.readString(tag.wireType);
          break;
        case 15:
          this.sBytes = r.readBytes(tag.wireType);
          break;
        case 16:
          r.readRepeatedInt32Into(tag.wireType, this.rI32);
          break;
        case 17:
          r.readRepeatedInt64Into(tag.wireType, this.rI64);
          break;
        case 18:
          r.readRepeatedUint32Into(tag.wireType, this.rU32);
          break;
        case 19:
          r.readRepeatedUint64Into(tag.wireType, this.rU64);
          break;
        case 20:
          r.readRepeatedSint32Into(tag.wireType, this.rSint32);
          break;
        case 21:
          r.readRepeatedSint64Into(tag.wireType, this.rSint64);
          break;
        case 22:
          r.readRepeatedFixed32Into(tag.wireType, this.rFixed32);
          break;
        case 23:
          r.readRepeatedFixed64Into(tag.wireType, this.rFixed64);
          break;
        case 24:
          r.readRepeatedSfixed32Into(tag.wireType, this.rSfixed32);
          break;
        case 25:
          r.readRepeatedSfixed64Into(tag.wireType, this.rSfixed64);
          break;
        case 26:
          r.readRepeatedFloatInto(tag.wireType, this.rFloat);
          break;
        case 27:
          r.readRepeatedDoubleInto(tag.wireType, this.rDouble);
          break;

      }
    }
  }

  @operator("==")
  __eq(rhs: MyType): bool {
    // TODO generate equality from codegen
    return false;
  }
}

describe("Integration", () => {
  it("roundtrip is stable", () => {
    const a = new MyType();
    const size = a.computeSizeProto();

    const buffer = new Array<u8>(size);
    const os = new OutputStream(buffer);
    const writer = new Writer(os);
    a.toProto(writer);

    const b = new MyType();
    const is = InputStream.fromBytes(buffer);
    const reader = new Reader(is);
    b.mergeFromProto(reader);

    expect<MyType>(b).toBe(a);
  })
})
