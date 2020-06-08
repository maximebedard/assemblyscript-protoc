import { WireType, Tag } from "./wire-format";
import { UnknownValue } from "./unknown";

export class Reader {
  private readonly _view: DataView;
  private _pos: i32;

  constructor(view: DataView) {
    this._view = view;
    this._pos = 0;
  }

  static fromBytes(bytes: Array<u8>): Reader {
    const view = new DataView(bytes.buffer, 0, bytes.length);
    return new Reader(view);
  }

  eof(): bool {
    return this._pos == this._view.byteLength;
  }

  pos(): i32 {
    return this._pos;
  }

  readByte(): u8 {
    const b = this._view.getUint8(this._pos);
    this._pos += 1;
    return b;
  }

  readBytes(len: u32): Array<u8> {
    const bytes = new Array<u8>(len);
    for (let i : u32 = 0; i < len; i += 1) {
      bytes.push(this.readByte());
    }
    return bytes;
  }

  readVarint32(): u32 {
    return this.readVarint64() as u32;
  }

  readVarint64(): u64 {
    let r: u64 = 0;

    for (let i = 0; i < 10; i += 1) {
      let b = this.readByte();

      // TODO: may overflow if i == 9
      r = r | (((b & 0x7f) as u64) << (i * 7));
      if (b < 0x80) {
        return r;
      }
    }

    throw new Error("WireError: Incorrect varint");
  }

  readInt32(): i32 {
    return (this.readVarint32() as i32);
  }

  readInt64(): i64 {
    return (this.readVarint64() as i64);
  }

  readUint32(): u32 {
    return (this.readVarint32() as u32);
  }

  readUint64(): u64 {
    return (this.readVarint64() as u64);
  }

  readSint32(): i32 {
    return decodeZigZag32(this.readUint32());
  }

  readSint64(): i64 {
    return decodeZigZag64(this.readUint64());
  }

  readFixed32(): u32 {
    const v = this._view.getUint32(this._pos, true);
    this._pos += 4;
    return v;
  }

  readFixed64(): u64 {
    const v = this._view.getUint64(this._pos, true);
    this._pos += 8;
    return v;
  }

  readSfixed32(): i32 {
    const v = this._view.getInt32(this._pos, true);
    this._pos += 4;
    return v;
  }

  readSfixed64(): i64 {
    const v = this._view.getInt64(this._pos, true);
    this._pos += 8;
    return v;
  }

  readFloat(): f32 {
    const v = this._view.getFloat32(this._pos, true);
    this._pos += 4;
    return v;
  }

  readDouble(): f64 {
    const v = this._view.getFloat64(this._pos, true);
    this._pos += 8;
    return v;
  }

  readBool(): bool {
    return this.readVarint32() != 0;
  }

  readTag(): Tag {
    return Tag.tryFromU32(this.readVarint32());
  }

  private readRepeatedPackedFixed<T>(size: u32, read: (r: Reader) => T): Array<T> {
    return [];
  }

  private readRepeatedPacked<T>(size: u32, read: (r: Reader) => T): Array<T> {
    return [];
  }

  readRepeatedPackedInt32(): Array<i32> {
    return this.readRepeatedPacked<i32>(4, (r: Reader) => { return r.readInt32(); });
  }

  readRepeatedPackedInt64(): Array<i64> {
    return this.readRepeatedPacked<i64>(8, (r: Reader) => { return r.readInt64(); });
  }

  readRepeatedPackedUint32(): Array<u32> {
    return this.readRepeatedPacked<u32>(4, (r: Reader) => { return r.readUint32(); });
  }

  readRepeatedPackedUint64(): Array<u64> {
    return this.readRepeatedPacked<u64>(8, (r: Reader) => { return r.readUint64(); });
  }

  readRepeatedPackedSint32(): Array<u32> {
    return this.readRepeatedPacked<u32>(4, (r: Reader) => { return r.readSint32(); });
  }

  readRepeatedPackedSint64(): Array<u64> {
    return this.readRepeatedPacked<u64>(8, (r: Reader) => { return r.readSint64(); });
  }

  readRepeatedPackedFixed32(): Array<u32> {
    return this.readRepeatedPackedFixed<u32>(4, (r: Reader) => { return r.readUint32(); });
  }

  readRepeatedPackedFixed64(): Array<u64> {
    return this.readRepeatedPackedFixed<u64>(8, (r: Reader) => { return r.readUint64(); });
  }

  readRepeatedPackedSfixed32(): Array<i32> {
    return this.readRepeatedPackedFixed<i32>(4, (r: Reader) => { return r.readSfixed32(); });
  }

  readRepeatedPackedSfixed64(): Array<i64> {
    return this.readRepeatedPackedFixed<i64>(8, (r: Reader) => { return r.readSfixed64(); });
  }

  readRepeatedPackedFloat(): Array<f32> {
    return this.readRepeatedPackedFixed<f32>(4, (r: Reader) => { return r.readFloat(); });
  }

  readRepeatedPackedDouble(): Array<f64> {
    return this.readRepeatedPackedFixed<f64>(8, (r: Reader) => { return r.readDouble(); });
  }

  readRepeatedPackedBool(): Array<bool> {
    return this.readRepeatedPacked<bool>(4, (r: Reader) => { return r.readBool(); });
  }

  readUnknown(wireType: WireType): UnknownValue {
    switch (wireType) {
      case WireType.Varint:
        return UnknownValue.varint(this.readVarint64());
      case WireType.Fixed64:
        return UnknownValue.fixed64(this.readFixed64());
      case WireType.LengthDelimited:
        const len = this.readVarint32();
        const bytes = this.readBytes(len);
        return UnknownValue.lengthDelimited(bytes);
      case WireType.Fixed32:
        return UnknownValue.fixed32(this.readFixed32());
      default:
        throw new Error("Invalid wire type");
    }
  }

  // TODO: figure out how to generate code to read {Enum, Message, repeated enums, repeated messages}...
}

function decodeZigZag64(v: u64): i64 {
  return ((v >> 1) as i64) ^ (-((v & 1) as i64));
}

function decodeZigZag32(v: u32): i32 {
  return ((v >> 1) as i32) ^ (-((v & 1) as i32));
}
