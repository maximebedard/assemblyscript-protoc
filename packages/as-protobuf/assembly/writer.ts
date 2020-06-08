import { Tag, WireType } from "./wire-format";

export class Writer {
  private readonly _bytes: u8[];
  private _view: DataView;
  private _pos: i32;

  constructor(bytes: Array<u8>) {
    this._bytes = bytes;
    this._view = new DataView(bytes.buffer, 0, bytes.length);
    this._pos = 0;
  }

  private growBuffer(size: u32): void {
    // There's most definitely a much more efficient way to do this...
    if ((this._bytes.length as u32) < size) {
      this._bytes.length += size;
      this._view = new DataView(this._bytes.buffer, 0, this._bytes.length);
    }
  }

  writeByte(v: u8): void {
    this.growBuffer(1);
    this._view.setUint8(this._pos, v);
    this._pos += len;
  }

  writeVarint32(v: u32): void {
    this.growBuffer(5);

    while (v >= 0x80) {
      this._view.setUint8(this._pos, (v as u8) | 0x80);
      this._pos += 1;
      v >>= 7;
    }

    this._view.setUint8(this._pos, v as u8);
    this._pos += 1;
  }

  writeVarint64(v: u64): void {
    this.growBuffer(5);

    while (v >= 0x80) {
      this._view.setUint8(this._pos, (v as u8) | 0x80);
      this._pos += 1;
      v >>= 7;
    }

    this._view.setUint8(this._pos, v as u8);
    this._pos += 1;
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
    this._view.setUint32(0, v, true);
    this.pos += 4;
  }

  private writeU64LE(v: u64): void {
    this.growBuffer(8);
    this._view.setUint64(0, v, true);
    this.pos += 8;
  }

  writeFloat(v: f32): void {
    this.growBuffer(4);
    this._view.setFloat32(0, v, true);
    this.pos += 4;
  }

  writeDouble(v: f64): void {
    this.growBuffer(8);
    this._view.setFloat64(0, v, true);
    this.pos += 8;
  }

  writeSint32(v: i32): void {
    this.writeUint64(encodeZigZag64(v));
  }

  writeSint64(v: i64): void {
    this.writeUint32(encodeZigZag32(v));
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

  writeSfixed64(v: i32): void {
    this.writeU64LE(v as u64);
  }

  writeBool(v: bool): void {
    this.writeVarint32(v ? 1 : 0);
  }

  writeTag(v: Tag): void {
    this.writeVarint32(v.value());
  }

  writeInt32Field(fieldNumber: u32, v: i32): void {}
  writeInt64Field(fieldNumber: u32, v: i64): void {}
  writeUint32Field(fieldNumber: u32, v: u32): void {}
  writeUint64Field(fieldNumber: u32, v: u64): void {}
  writeSint32Field(fieldNumber: u32, v: i32): void {}
  writeSint64Field(fieldNumber: u32, v: i64): void {}
  writeFixed32Field(fieldNumber: u32, v: u32): void {}
  writeFixed64Field(fieldNumber: u32, v: u64): void {}
  writeSfixed32Field(fieldNumber: u32, v: i32): void {}
  writeSfixed64Field(fieldNumber: u32, v: i64): void {}
  writeFloatField(fieldNumber: u32, v: f32): void {}
  writeDoubleField(fieldNumber: u32, v: f64): void {}
  writeBoolField(fieldNumber: u32, v: bool): void {}
  writeStringField(fieldNumber: u32, v: string): void {}
  writeBytesField(fieldNumber: u32, v: Array<u8>): void {}
}

function encodeZigZag32(v: i32): u32 {
  return ((v << 1) ^ (v >> 31)) as u32;
}

function encodeZigZag64(v: i64): u64 {
  return ((v << 1) ^ (v >> 63)) as u64;
}




