import { WireType, Tag } from "./wire-format";
import { UnknownValue } from "./unknown";
import { decodeZigZag32, decodeZigZag64 } from "./zig-zag";

export class InputStream {
  private readonly _view: DataView;
  private _pos: i32;

  constructor(view: DataView) {
    this._view = view;
    this._pos = 0;
  }

  static fromArrayBuffer(buffer: ArrayBuffer): InputStream {
    const view = new DataView(buffer, 0, buffer.byteLength / 4);
    return new InputStream(view);
  }

  static fromBytes(bytes: Array<u8>): InputStream {
    const view = new DataView(bytes.buffer, 0, bytes.length);
    return new InputStream(view);
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

  private readRepeatedPackedFixed<T>(size: u32, dest: Array<T>, f: (is: InputStream) => T): Array<T> {
    return [];
  }

  private readRepeatedPacked<T>(size: u32, dest: Array<T>, f: (is: InputStream) => T): Array<T> {
    return [];
  }

  readRepeatedInt32Into(dest: Array<i32>): void {
    this.readRepeatedPacked<i32>(4, dest, (is: InputStream) => is.readInt32());
  }

  readRepeatedInt64Into(dest: Array<i64>): void {
    this.readRepeatedPacked<i64>(8, dest, (is: InputStream) => is.readInt64());
  }

  readRepeatedUint32Into(dest: Array<u32>): void {
    this.readRepeatedPacked<u32>(4, dest, (is: InputStream) => is.readUint32());
  }

  readRepeatedUint64Into(dest: Array<u64>): void {
    this.readRepeatedPacked<u64>(8, dest, (is: InputStream) => is.readUint64());
  }

  readRepeatedSint32Into(dest: Array<i32>): void {
    this.readRepeatedPacked<i32>(4, dest, (is: InputStream) => is.readSint32());
  }

  readRepeatedSint64Into(dest: Array<i64>): void {
    this.readRepeatedPacked<i64>(8, dest, (is: InputStream) => is.readSint64());
  }

  readRepeatedFixed32Into(dest: Array<u32>): void {
    this.readRepeatedPackedFixed<u32>(4, dest, (is: InputStream) => is.readUint32());
  }

  readRepeatedFixed64Into(dest: Array<u64>): void {
    this.readRepeatedPackedFixed<u64>(8, dest, (is: InputStream) => is.readUint64());
  }

  readRepeatedSfixed32Into(dest: Array<i32>): void {
    this.readRepeatedPackedFixed<i32>(4, dest, (is: InputStream) => is.readSfixed32());
  }

  readRepeatedSfixed64Into(dest: Array<i64>): void {
    this.readRepeatedPackedFixed<i64>(8, dest, (is: InputStream) => is.readSfixed64());
  }

  readRepeatedFloatInto(dest: Array<f32>): void {
    this.readRepeatedPackedFixed<f32>(4, dest, (is: InputStream) => is.readFloat());
  }

  readRepeatedDoubleInto(dest: Array<f64>): void {
    this.readRepeatedPackedFixed<f64>(8, dest, (is: InputStream) => is.readDouble());
  }

  readRepeatedBoolInto(dest: Array<bool>): void {
    this.readRepeatedPacked<bool>(4, dest, (is: InputStream) => is.readBool());
  }

  // TODO: figure out how to generate code to read {Enum, Message, repeated enums, repeated messages}...
}

export class Reader {
  private readonly _is: InputStream;

  constructor(is: InputStream) {
    this._is = is;
  }

  eof(): bool {
    return this._is.eof();
  }

  readTag(): Tag {
    return this._is.readTag();
  }

  readInt32(wireType: WireType): i32 {
    expectWireType(wireType, WireType.Varint);
    return this._is.readInt32();
  }

  readInt64(wireType: WireType): i64 {
    expectWireType(wireType, WireType.Varint);
    return this._is.readInt64();
  }

  readUint32(wireType: WireType): u32 {
    expectWireType(wireType, WireType.Varint);
    return this._is.readUint32();
  }

  readUint64(wireType: WireType): u64 {
    expectWireType(wireType, WireType.Varint);
    return this._is.readUint64();
  }

  readSint32(wireType: WireType): i32 {
    expectWireType(wireType, WireType.Varint);
    return this._is.readSint32();
  }

  readSint64(wireType: WireType): i64 {
    expectWireType(wireType, WireType.Varint);
    return this._is.readSint64();
  }

  readFixed32(wireType: WireType): u32 {
    expectWireType(wireType, WireType.Fixed32);
    return this._is.readFixed32();
  }

  readFixed64(wireType: WireType): u64 {
    expectWireType(wireType, WireType.Fixed64);
    return this._is.readFixed64();
  }

  readSfixed32(wireType: WireType): i32 {
    expectWireType(wireType, WireType.Fixed32);
    return this._is.readSfixed32();
  }

  readSfixed64(wireType: WireType): i64 {
    expectWireType(wireType, WireType.Fixed64);
    return this._is.readSfixed64();
  }

  readFloat(wireType: WireType): f32 {
    expectWireType(wireType, WireType.Fixed32);
    return this._is.readFloat();
  }

  readDouble(wireType: WireType): f64 {
    expectWireType(wireType, WireType.Fixed64);
    return this._is.readDouble();
  }

  readBool(wireType: WireType): bool {
    expectWireType(wireType, WireType.Varint);
    return this._is.readBool();
  }

  readString(wireType: WireType): string {
    return "";
  }

  readBytes(wireType: WireType): Array<u8> {
    return [];
  }

  readRepeatedInt32Into(wireType: WireType, dest: Array<i32>): void {
    switch (wireType) {
      case WireType.LengthDelimited:
        this._is.readRepeatedInt32Into(dest);
        break;
      case WireType.Varint:
        dest.push(this._is.readInt32());
        break;
      default:
        unexpectedWireType(wireType);
        break;
    }
  }

  readRepeatedInt64Into(wireType: WireType, dest: Array<i64>): void {
    switch (wireType) {
      case WireType.LengthDelimited:
        this._is.readRepeatedInt64Into(dest);
        break;
      case WireType.Varint:
        dest.push(this._is.readInt64());
        break;
      default:
        unexpectedWireType(wireType);
        break;
    }
  }

  readRepeatedUint32Into(wireType: WireType, dest: Array<u32>): void {
    switch (wireType) {
      case WireType.LengthDelimited:
        this._is.readRepeatedUint32Into(dest);
        break;
      case WireType.Varint:
        dest.push(this._is.readUint32());
        break;
      default:
        unexpectedWireType(wireType);
        break;
    }
  }

  readRepeatedUint64Into(wireType: WireType, dest: Array<u64>): void {
    switch (wireType) {
      case WireType.LengthDelimited:
        this._is.readRepeatedUint64Into(dest);
        break;
      case WireType.Varint:
        dest.push(this._is.readUint64());
        break;
      default:
        unexpectedWireType(wireType);
        break;
    }
  }

  readRepeatedSint32Into(wireType: WireType, dest: Array<i32>): void {
    switch (wireType) {
      case WireType.LengthDelimited:
        this._is.readRepeatedSint32Into(dest);
        break;
      case WireType.Varint:
        dest.push(this._is.readSint32());
        break;
      default:
        unexpectedWireType(wireType);
        break;
    }
  }

  readRepeatedSint64Into(wireType: WireType, dest: Array<i64>): void {
    switch (wireType) {
      case WireType.LengthDelimited:
        this._is.readRepeatedSint64Into(dest);
        break;
      case WireType.Varint:
        dest.push(this._is.readSint64());
        break;
      default:
        unexpectedWireType(wireType);
        break;
    }
  }

  readRepeatedFixed32Into(wireType: WireType, dest: Array<u32>): void {
    switch (wireType) {
      case WireType.LengthDelimited:
        this._is.readRepeatedFixed32Into(dest);
        break;
      case WireType.Fixed32:
        dest.push(this._is.readFixed32());
        break;
      default:
        unexpectedWireType(wireType);
        break;
    }
  }

  readRepeatedFixed64Into(wireType: WireType, dest: Array<u64>): void {
    switch (wireType) {
      case WireType.LengthDelimited:
        this._is.readRepeatedFixed64Into(dest);
        break;
      case WireType.Fixed64:
        dest.push(this._is.readFixed64());
        break;
      default:
        unexpectedWireType(wireType);
        break;
    }
  }

  readRepeatedSfixed32Into(wireType: WireType, dest: Array<i32>): void {
    switch (wireType) {
      case WireType.LengthDelimited:
        this._is.readRepeatedSfixed32Into(dest);
        break;
      case WireType.Fixed32:
        dest.push(this._is.readSfixed32());
        break;
      default:
        unexpectedWireType(wireType);
        break;
    }
  }

  readRepeatedSfixed64Into(wireType: WireType, dest: Array<i64>): void {
    switch (wireType) {
      case WireType.LengthDelimited:
        this._is.readRepeatedSfixed64Into(dest);
        break;
      case WireType.Fixed64:
        dest.push(this._is.readSfixed64());
        break;
      default:
        unexpectedWireType(wireType);
        break;
    }
  }

  readRepeatedFloatInto(wireType: WireType, dest: Array<f32>): void {
    switch (wireType) {
      case WireType.LengthDelimited:
        this._is.readRepeatedFloatInto(dest);
        break;
      case WireType.Fixed32:
        dest.push(this._is.readFloat());
        break;
      default:
        unexpectedWireType(wireType);
        break;
    }
  }

  readRepeatedDoubleInto(wireType: WireType, dest: Array<f64>): void {
    switch (wireType) {
      case WireType.LengthDelimited:
        this._is.readRepeatedDoubleInto(dest);
        break;
      case WireType.Fixed64:
        dest.push(this._is.readDouble());
        break;
      default:
        unexpectedWireType(wireType);
        break;
    }
  }

  readRepeatedBoolInto(wireType: WireType, dest: Array<bool>): void {}

  readRepeatedStringInto(wireType: WireType, dest: Array<string>): void {}

  readRepeatedBytesInto(wireType: WireType, dest: Array<Array<u8>>): void {}

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

  skipGroup(): void {
    while (!this.eof()) {
      const tag = this.readTag();
      if (tag.wireType == WireType.EndGroup) {
        return;
      }

      this.skipField(tag.wireType);
    }
  }

  skipField(wireType: WireType): void {
    this.readUnknown(wireType);
  }

  skipRawBytes(len: u32): void {
    this.readRawBytes(len);
  }
}

function unexpectedWireType(wireType: WireType): void {
  throw new Error(`unexpected ${wireType}`);
}

function expectWireType(expected: WireType, actual: WireType): void {
  if (expected != actual) {
    throw new Error(`expected ${expected}, got ${actual}`);
  }
}
