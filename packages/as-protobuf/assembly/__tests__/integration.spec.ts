import { Reader, Writer, WireType } from "../";
import * as Rt from "../runtime";

class MyTypeA {
  // TODO: bytes
  // TODO: string
  // TODO: enum, nested enum, foreign enum
  // TODO: message, nested message, foreign message

  // singular fields
  s_i32: i32;
  s_i64: i64;
  s_u32: u32;
  s_u64: u64;
  s_sint32: i32;
  s_sint64: i64;
  s_fixed32: u32;
  s_fixed64: u64;
  s_sfixed32: i32;
  s_sfixed64: i64;
  s_float: f32;
  s_double: f64;
  s_bool: bool;
  s_string: string;
  s_bytes: Array<u8>;

  // repeated fields
  r_i32: Array<i32>;
  r_i64: Array<i64>;
  r_u32: Array<u32>;
  r_u64: Array<u64>;
  r_sint32: Array<i32>;
  r_sint64: Array<i64>;
  r_fixed32: Array<u32>;
  r_fixed64: Array<u64>;
  r_sfixed32: Array<i32>;
  r_sfixed64: Array<i64>;
  r_float: Array<f32>;
  r_double: Array<f64>;
  r_bool: Array<bool>;
  r_string: Array<string>;
  r_byte: Array<Array<u8>>;

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
    if (this.s_i32 != 0) size += Rt.valueSize<i32>(1, this.s_i32, WireType.Varint);
    if (this.s_i64 != 0) size += Rt.valueSize<i64>(2, this.s_i64, WireType.Varint);
    if (this.s_u32 != 0) size += Rt.valueSize<u32>(3, this.s_u32, WireType.Varint);
    if (this.s_u64 != 0) size += Rt.valueSize<u64>(4, this.s_u64, WireType.Varint);
    if (this.s_sint32 != 0) size += Rt.valueVarintZigZagSize<i32>(5, this.s_sint32);
    if (this.s_sint64 != 0) size += Rt.valueVarintZigZagSize<i64>(6, this.s_sint64);
    if (this.s_fixed32 != 0) size += 5;
    if (this.s_fixed64 != 0) size += 9;
    if (this.s_sfixed32 != 0) size += 5;
    if (this.s_sfixed64 != 0) size += 9;
    if (this.s_float != 0.) size += 5;
    if (this.s_double != 0.) size += 9;
    if (!this.s_bool) size += 2;

    // repeated fields
    for (let i = 0; i < this.r_i32.length; i += 1) {
      size += Rt.valueSize(13, this.r_i32[i], WireType.Varint);
    }
    for (let i = 0; i < this.r_i64.length; i += 1) {
      size += Rt.valueSize(14, this.r_i64[i], WireType.Varint);
    }
    for (let i = 0; i < this.r_u32.length; i += 1) {
      size += Rt.valueSize(15, this.r_u32[i], WireType.Varint);
    }
    for (let i = 0; i < this.r_u64.length; i += 1) {
      size += Rt.valueSize(16, this.r_u64[i], WireType.Varint);
    }
    for (let i = 0; i < this.r_sint32.length; i += 1) {
      size += Rt.valueVarintZigZagSize(17, this.r_sint32[i]);
    }
    for (let i = 0; i < this.r_sint64.length; i += 1) {
      size += Rt.valueVarintZigZagSize(18, this.r_sint64[i]);
    }
    size += 6 * this.r_fixed32.length;
    size += 10 * this.r_fixed64.length;
    size += 6 * this.r_sfixed32.length;
    size += 10 * this.r_sfixed64.length;
    size += 6 * this.r_float.length;
    size += 10 * this.r_double.length;
    size += 3 * this.r_bool.length;

    return size;
  }

  toProto(w: Writer): void {
    // singular fields
    if (this.s_i32 != 0) w.writeInt32Field(1, this.s_i32);
    if (this.s_i64 != 0) w.writeInt64Field(2, this.s_i64);
    if (this.s_u32 != 0) w.writeUint32Field(3, this.s_u32);
    if (this.s_u64 != 0) w.writeUint64Field(4, this.s_u64);
    if (this.s_sint32 != 0) w.writeSint32Field(5, this.s_sint32);
    if (this.s_sint64 != 0) w.writeSint64Field(6, this.s_sint64);
    if (this.s_fixed32 != 0) w.writeFixed32Field(7, this.s_fixed32);
    if (this.s_fixed64 != 0) w.writeFixed64Field(8, this.s_fixed64);
    if (this.s_sfixed32 != 0) w.writeSfixed32Field(9, this.s_sfixed32);
    if (this.s_sfixed64 != 0) w.writeSfixed64Field(10, this.s_sfixed64);
    if (this.s_float != 0.) w.writeFloatField(11, this.s_float);
    if (this.s_double != 0.) w.writeDoubleField(12, this.s_double);
    if (!this.s_bool)  w.writeBoolField(13, this.s_bool);

    // repeated fields
    for (let i = 0; i < this.r_i32.length; i += 1) {
      w.writeInt32Field(1, this.r_i32[i]);
    }
    for (let i = 0; i < this.r_i64.length; i += 1) {
      w.writeInt64Field(2, this.r_i64[i]);
    }
    for (let i = 0; i < this.r_u32.length; i += 1) {
      w.writeUint32Field(3, this.r_u32[i]);
    }
    for (let i = 0; i < this.r_u64.length; i += 1) {
      w.writeUint64Field(4, this.r_u64[i]);
    }
    for (let i = 0; i < this.r_sint32.length; i += 1) {
      w.writeSint32Field(5, this.r_sint32[i]);
    }
    for (let i = 0; i < this.r_sint64.length; i += 1) {
      w.writeSint64Field(6, this.r_sint64[i]);
    }
    for (let i = 0; i < this.r_fixed32.length; i += 1) {
      w.writeFixed32Field(7, this.r_fixed32[i]);
    }
    for (let i = 0; i < this.r_fixed64.length; i += 1) {
      w.writeFixed64Field(8, this.r_fixed64[i]);
    }
    for (let i = 0; i < this.r_sfixed32.length; i += 1) {
      w.writeSfixed32Field(9, this.r_sfixed32[i]);
    }
    for (let i = 0; i < this.r_sfixed64.length; i += 1) {
      w.writeSfixed64Field(10, this.r_sfixed64[i]);
    }
    for (let i = 0; i < this.r_float.length; i += 1) {
      w.writeFloatField(11, this.r_float[i]);
    }
    for (let i = 0; i < this.r_double.length; i += 1) {
      w.writeDoubleField(12, this.r_double[i]);
    }
    for (let i = 0; i < this.r_bool.length; i += 1) {
      w.writeBoolField(13, this.r_bool[i]);
    }
  }

  mergeFromProto(r: Reader): void {
    while(!r.eof()) {
      const tag = r.readTag();
      switch (tag.fieldNumber) {
        case 1:
          Rt.expectWireType(tag.wireType, WireType.Varint);
          this.s_i32 = r.readInt32();
          break;
        case 2:
          Rt.expectWireType(tag.wireType, WireType.Varint);
          this.s_i64 = r.readInt64();
          break;
        case 3:
          Rt.expectWireType(tag.wireType, WireType.Varint);
          this.s_u32 = r.readUint32();
          break;
        case 4:
          Rt.expectWireType(tag.wireType, WireType.Varint);
          this.s_u64 = r.readUint64();
          break;
        case 5:
          Rt.expectWireType(tag.wireType, WireType.Varint);
          this.s_sint32 = r.readSint32();
          break;
        case 6:
          Rt.expectWireType(tag.wireType, WireType.Varint);
          this.s_sint64 = r.readSint64();
          break;
        case 7:
          Rt.expectWireType(tag.wireType, WireType.Fixed32);
          this.s_fixed32 = r.readFixed32();
          break;
        case 8:
          Rt.expectWireType(tag.wireType, WireType.Fixed64);
          this.s_fixed64 = r.readFixed64();
          break;
        case 9:
          Rt.expectWireType(tag.wireType, WireType.Fixed32);
          this.s_sfixed32 = r.readSfixed32();
          break;
        case 10:
          Rt.expectWireType(tag.wireType, WireType.Fixed64);
          this.s_sfixed64 = r.readSfixed64();
          break;
        case 11:
          Rt.expectWireType(tag.wireType, WireType.Fixed32);
          this.s_float = r.readFloat();
          break;
        case 12:
          Rt.expectWireType(tag.wireType, WireType.Fixed64);
          this.s_double = r.readDouble();
          break;
        case 13:
          Rt.expectWireType(tag.wireType, WireType.Varint);
          this.s_bool = r.readBool();
          break;
      }
    }
  }

  @operator("==")
  __eq(rhs: MyTypeA): bool {
    return false;
  }
}

describe("Integration", () => {
  it("roundtrip is stable", () => {
    const a = new MyTypeA();
    const size = a.computeSizeProto();

    const buffer : u8[] = [];
    const writer = new Writer(buffer);
    a.toProto(writer);

    const b = new MyTypeA();
    const reader = Reader.fromByteArray(buffer);
    b.mergeFromProto(reader);

    expect<MyTypeA>(b).toBe(a);
  })
})
