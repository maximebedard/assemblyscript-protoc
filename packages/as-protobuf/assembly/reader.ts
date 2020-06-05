export class Reader {
  private readonly _view: DataView;
  private _pos: i32;

  constructor(view: DataView) {
    this._view = view;
    this._pos = 0;
  }

  static fromByteArray(bytes: u8[]): Reader {
    const view = new DataView(bytes.buffer, 0, bytes.length);
    return new Reader(view);
  }

  eof(): bool {
    return this._pos == this._view.byteLength;
  }

  pos(): i32 {
    return this._pos;
  }

  readUint8(): u8 {
    const b = this._view.getUint8(this._pos);
    this._pos += 1;
    return b;
  }

  readVarint32(): u32 {
    return this.readVarint64() as u32;
  }

  readVarint64(): u64 {
    let r: u64 = 0;

    for (let i = 0; i < 10; i += 1) {
      let b = this.readUint8();

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

  readUint32(): u32 {
    return (this.readVarint32() as u32);
  }

  readInt64(): i64 {
    return (this.readVarint64() as i64);
  }

  readUint64(): u64 {
    return (this.readVarint64() as u64);
  }

  readFloat(): f32 {
    const b = this._view.getFloat32(this._pos, true);
    this._pos += 4;
    return b;
  }

  readDouble(): f64 {
    const b = this._view.getFloat64(this._pos, true);
    this._pos += 8;
    return b;
  }

  readSint32(): i32 {
    return decodeZigZag32(this.readUint32());
  }

  readSint64(): i64 {
    return decodeZigZag64(this.readUint64());
  }

  readBool(): bool {
    return this.readVarint32() != 0;
  }

  readTag(): Tag {
    return Tag.tryFromU32(this.readVarint32());
  }

  private readRepeatedPackedFixed<T>(encoded_size: u32, read: (reader: Reader) => T): T[] {
    return [];
  }

  private readRepeatedPacked<T>(encoded_size: u32, read: (reader: Reader) => T): T[] {
    return [];
  }

  readRepeatedPackedDouble(): f64[] {
    return this.readRepeatedPackedFixed<f64>(123, (reader: Reader) => { return reader.readDouble() });
  }

  readRepeatedPackedFloat(): f32[] {
    return this.readRepeatedPackedFixed<f64>(123, (reader: Reader) => { return reader.readFloat() });
  }

  readRepeatedPackedInt32(): i32[] {
    return this.readRepeatedPacked<i32>(123, (reader: Reader) => { return reader.readInt32() });
  }

  readRepeatedPackedInt64(): i64[] {
    return this.readRepeatedPacked<i64>(123, (reader: Reader) => { return reader.readInt64() });
  }

  readRepeatedPackedUint32(): u32[] {
    return this.readRepeatedPacked<u32>(123, (reader: Reader) => { return reader.readUint32() });
  }

  readRepeatedPackedUint64(): u64[] {
    return this.readRepeatedPacked<u64>(123, (reader: Reader) => { return reader.readUint64() });
  }

  readRepeatedPackedSint32(): u64[] {
    return this.readRepeatedPacked<u64>(123, (reader: Reader) => { return reader.readSint32() });
  }

  readRepeatedPackedSint64(): u64[] {
    return this.readRepeatedPacked<u64>(123, (reader: Reader) => { return reader.readSint64() });
  }

  readRepeatedPackedFixed32(): u32[] {
    return this.readRepeatedPackedFixed<u32>(123, (reader: Reader) => { return reader.readUint64() });
  }

  readRepeatedPackedFixed64(): u64[] {
    return this.readRepeatedPackedFixed<u64>(123, (reader: Reader) => { return reader.readUint64() });
  }

  readRepeatedPackedSfixed32(): i32[] {
    return this.readRepeatedPackedFixed<i32>(123, (reader: Reader) => { return reader.readUint64() });
  }

  readRepeatedPackedSfixed64(): i64[] {
    return this.readRepeatedPackedFixed<i64>(123, (reader: Reader) => { return reader.readUint64() });
  }

  readRepeatedPackedBool(): bool[] {
    return this.readRepeatedPacked<bool>(123, (reader: Reader) => { return reader.readBool() });
  }



  // TODO: read unknown
  // TODO: read repeated packed generic
  // TODO: figure out how to generate code to read {Enum, Message, repeated enums, repeated messages}...
}

function decodeZigZag64(v: u64): i64 {
  return ((v >> 1) as i64) ^ (-((v & 1) as i64));
}

function decodeZigZag32(v: u32): i32 {
  return ((v >> 1) as i32) ^ (-((v & 1) as i32));
}
