export class Writer {
  private readonly _view: DataView;
  private _pos: i32;

  constructor(view: DataView) {
    this._view = view;
    this._pos = 0;
  }

  writeUint8(v: u8): void {
  }

  writeVarint32(v: u32): void {
  }

  writeVarint64(v: u64): void {
  }

  writeInt32(v: i32): void {
  }

  writeUint32(v: u32): void {
  }

  writeInt64(v: i64): void {
  }

  writeUint64(v: u64): void {
  }

  writeFloat(v: f32): void {
  }

  writeDouble(v: f64): void {
  }

  writeSint32(v: i32): void {
  }

  writeSint64(v: i64): void {
  }

  writeBool(v: bool): void {
  }
}

function encodeZigZag32(v: i32): u32 {
  return ((v << 1) ^ (v >> 31)) as u32;
}

function encodeZigZag64(v: i64): u64 {
  return ((v << 1) ^ (v >> 63)) as u64;
}




