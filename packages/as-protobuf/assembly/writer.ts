import { Tag, WireType } from "./wire-format";
import { encodeZigZag32, encodeZigZag64 } from "./zig-zag";

// TODO: profile and potentially optimize buffer reallocations.
// TODO: _pos should be a u32
export class OutputStream {
  private readonly _buffer: Array<u8>;
  private _pos: i32;

  constructor(buffer: Array<u8>) {
    this._buffer = buffer;
    this._pos = 0;
  }

  writeByte(v: u8): void {
    this._buffer.push(v);
    this._pos += 1;
  }

  writeBytes(v: Array<u8>): void {
    for (let i = 0; i < v.length; i += 1) {
      this.writeByte(v[i]);
    }
  }

  writeVarint32(v: u32): void {
    const tmp = new Array<u8>(5);
    const len = encodeVarintInto<u32>(v, tmp);
    // TODO: copy into this._buffer[this._pos..];
    for (let i: u32 = 0; i < len; i += 1) {
      this._buffer.push(tmp[i]);
    }
    this._pos += len;
  }

  writeVarint64(v: u64): void {
    const tmp = new Array<u8>(10);
    const len = encodeVarintInto<u64>(v, tmp);
    // TODO: copy into this._buffer[this._pos..];
    for (let i: u32 = 0; i < len; i += 1) {
      this._buffer.push(tmp[i]);
    }
    this._pos += len;
  }

  writeInt32(v: i32): void {
    this.writeVarint64(v as u64);
  }

  writeInt64(v: i64): void {
    this.writeVarint64(v as u64);
  }

  writeUint32(v: u32): void {
    this.writeVarint32(v);
  }

  writeUint64(v: u64): void {
    this.writeVarint64(v);
  }

  private writeU32LE(v: u32): void {
    this.growBuffer(4);
    new DataView(this._buffer.buffer, this._pos, 4).setUint32(0, v, true);
    this._pos += 4;
  }

  private writeU64LE(v: u64): void {
    this.growBuffer(8);
    new DataView(this._buffer.buffer, this._pos, 8).setUint64(0, v, true);
    this._pos += 8;
  }

  private growBuffer(len: i32): void {
    if (this._buffer.length - this._pos < len) {
      this._buffer.length += this._buffer.length - this._pos + len;
    }
  }

  writeFloat(v: f32): void {
    this.growBuffer(4);
    new DataView(this._buffer.buffer, this._pos, 4).setFloat32(0, v, true);
    this._pos += 4;
  }

  writeDouble(v: f64): void {
    this.growBuffer(8);
    new DataView(this._buffer.buffer, this._pos, 8).setFloat64(0, v, true);
    this._pos += 8;
  }

  writeSint32(v: i32): void {
    this.writeUint32(encodeZigZag32(v));
  }

  writeSint64(v: i64): void {
    this.writeUint64(encodeZigZag64(v));
  }

  writeFixed32(v: u32): void {
    this.writeU32LE(v);
  }

  writeFixed64(v: u64): void {
    this.writeU64LE(v);
  }

  writeSfixed32(v: i32): void {
    this.writeU32LE(v as u32);
  }

  writeSfixed64(v: i64): void {
    this.writeU64LE(v as u64);
  }

  writeBool(v: bool): void {
    this.writeVarint32(v ? 1 : 0);
  }

  writeTag(v: Tag): void {
    this.writeVarint32(v.asU32());
  }
}

function encodeVarintInto<T>(v: T, dest: Array<u8>): u32 {
  let i: u32 = 0;
  while (v >= 0x80) {
    dest[i] = ((v as u8) | 0x80);
    v = v >> 7;
    i += 1;
  }
  dest[i] = v as u8;
  return i + 1;
}

export class Writer {
  private readonly _os: OutputStream;

  constructor(os: OutputStream) {
    this._os = os;
  }

  writeInt32(fieldNumber: u32, v: i32): void {
    this._os.writeTag(Tag.varint(fieldNumber));
    this._os.writeInt32(v);
  }

  writeInt64(fieldNumber: u32, v: i64): void {
    this._os.writeTag(Tag.varint(fieldNumber));
    this._os.writeInt64(v);
  }

  writeUint32(fieldNumber: u32, v: u32): void {
    this._os.writeTag(Tag.varint(fieldNumber));
    this._os.writeUint32(v);
  }

  writeUint64(fieldNumber: u32, v: u64): void {
    this._os.writeTag(Tag.varint(fieldNumber));
    this._os.writeUint64(v);
  }

  writeSint32(fieldNumber: u32, v: i32): void {
    this._os.writeTag(Tag.varint(fieldNumber));
    this._os.writeSint32(v);
  }

  writeSint64(fieldNumber: u32, v: i64): void {
    this._os.writeTag(Tag.varint(fieldNumber));
    this._os.writeSint64(v);
  }

  writeFixed32(fieldNumber: u32, v: u32): void {
    this._os.writeTag(Tag.varint(fieldNumber));
    this._os.writeFixed32(v);
  }

  writeFixed64(fieldNumber: u32, v: u64): void {
    this._os.writeTag(Tag.varint(fieldNumber));
    this._os.writeFixed64(v);
  }

  writeSfixed32(fieldNumber: u32, v: i32): void {
    this._os.writeTag(Tag.fixed32(fieldNumber));
    this._os.writeSfixed32(v);
  }

  writeSfixed64(fieldNumber: u32, v: i64): void {
    this._os.writeTag(Tag.fixed64(fieldNumber));
    this._os.writeSfixed64(v);
  }

  writeFloat(fieldNumber: u32, v: f32): void {
    this._os.writeTag(Tag.fixed32(fieldNumber));
    this._os.writeFloat(v);
  }

  writeDouble(fieldNumber: u32, v: f64): void {
    this._os.writeTag(Tag.fixed64(fieldNumber));
    this._os.writeDouble(v);
  }

  writeBool(fieldNumber: u32, v: bool): void {
    this._os.writeTag(Tag.varint(fieldNumber));
    this._os.writeBool(v);
  }

  writeString(fieldNumber: u32, v: string): void {
    this._os.writeTag(Tag.lengthDelimited(fieldNumber));
    // const buffer = String.UTF8.encode(v);
    // this._os.writeVarint32(buffer.length)
    // // this.os
  }

  writeBytes(fieldNumber: u32, v: Array<u8>): void {
    this._os.writeTag(Tag.lengthDelimited(fieldNumber));
    this._os.writeVarint32(v.length as u32);
    this._os.writeBytes(v);
  }
}
