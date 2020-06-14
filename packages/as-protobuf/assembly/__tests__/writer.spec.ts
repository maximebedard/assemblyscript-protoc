import { OutputStream, Writer, Tag, WireType } from "../";

function expectWrittenBytes(bytes: Array<u8>, write: (os: OutputStream) => void): void {
  const buffer = new Array<u8>();
  const writer = new OutputStream(buffer);
  write(writer);
  expect<Array<u8>>(buffer).toStrictEqual(bytes);
}

describe("OutputStream", () => {
  it("writeByte", () => {
    expectWrittenBytes(
      [0xA1],
      (os: OutputStream) => { os.writeByte(0xA1) },
    );
  });

  it("writeBytes", () => {
    expectWrittenBytes(
      [0xA1, 0xB2],
      (os: OutputStream) => { os.writeBytes([0xA1, 0xB2]) },
    );
  });

  it("writeVarint32", () => {
    expectWrittenBytes(
      [0x96, 0x01],
      (os: OutputStream) => { os.writeVarint32(150); }
    );

    expectWrittenBytes(
      [0xFF, 0xFF, 0xFF, 0xFF, 0x0F],
      (os: OutputStream) => { os.writeVarint32(0xffffffff as u32); }
    );
  });

  it("writeVarint64", () => {
    expectWrittenBytes(
      [0x96, 0x01],
      (os: OutputStream) => { os.writeVarint64(150); }
    );

    expectWrittenBytes(
      [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x01],
      (os: OutputStream) => { os.writeVarint64(0xffffffffffffffff as u64); }
    );
  });

  it("writeInt32", () => {
    expectWrittenBytes(
      [0x80, 0x80, 0x80, 0x80, 0xF8, 0xFF, 0xFF, 0xFF, 0xFF, 0x01],
      (os: OutputStream) => { os.writeInt32(I32.MIN_VALUE); }
    );
    expectWrittenBytes(
      [0xFF, 0xFF, 0xFF, 0xFF, 0x07],
      (os: OutputStream) => { os.writeInt32(I32.MAX_VALUE); }
    );
    expectWrittenBytes(
      [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x01],
      (os: OutputStream) => { os.writeInt32(-1); }
    );
  });

  it("writeInt64", () => {
    expectWrittenBytes(
      [0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x01],
      (os: OutputStream) => { os.writeInt64(I64.MIN_VALUE); }
    );
    expectWrittenBytes(
      [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x7F],
      (os: OutputStream) => { os.writeInt64(I64.MAX_VALUE); }
    );
    expectWrittenBytes(
      [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x01],
      (os: OutputStream) => { os.writeInt64(-1); }
    );
  });

  it("writeFloat", () => {
    expectWrittenBytes(
      [0x95, 0x73, 0x13, 0x61],
      (os: OutputStream) => { os.writeFloat(17e19); }
    );
  });

  it("writeDouble", () => {
    expectWrittenBytes(
      [0x40, 0xD5, 0xAB, 0x68, 0xB3, 0x07, 0x3D, 0x46],
      (os: OutputStream) => { os.writeDouble(23e29); }
    );
  });

  xit("writeSint32", () => {
    expectWrittenBytes(
      [],
      (os: OutputStream) => { os.writeSint32(1337); }
    );
  });

  xit("writeSint64", () => {
    expectWrittenBytes(
      [],
      (os: OutputStream) => { os.writeSint64(1337); }
    );
  });

  xit("writeFixed32", () => {
    expectWrittenBytes(
      [],
      (os: OutputStream) => { os.writeFixed32(1337); }
    );
  });

  xit("writeFixed64", () => {
    expectWrittenBytes(
      [],
      (os: OutputStream) => { os.writeFixed64(1337); }
    );
  });

  xit("writeSfixed32", () => {
    expectWrittenBytes(
      [],
      (os: OutputStream) => { os.writeSfixed32(1337); }
    );
  });

  xit("writeSfixed64", () => {
    expectWrittenBytes(
      [],
      (os: OutputStream) => { os.writeSfixed64(1337); }
    );
  });

  it("writeBool", () => {
    expectWrittenBytes([0x01], (os: OutputStream) => { os.writeBool(true); });
    expectWrittenBytes([0x00], (os: OutputStream) => { os.writeBool(false); });
  });

  xit("writeString", () => {});

  it("writeTag", () => {
    expectWrittenBytes([0x08], (os: OutputStream) => { os.writeTag(new Tag(1, WireType.Varint)); });
    expectWrittenBytes([0x09], (os: OutputStream) => { os.writeTag(new Tag(1, WireType.Fixed64)); });
    expectWrittenBytes([0x0A], (os: OutputStream) => { os.writeTag(new Tag(1, WireType.LengthDelimited)); });
    expectWrittenBytes([0x0B], (os: OutputStream) => { os.writeTag(new Tag(1, WireType.StartGroup)); });
    expectWrittenBytes([0x0C], (os: OutputStream) => { os.writeTag(new Tag(1, WireType.EndGroup)); });
    expectWrittenBytes([0x0D], (os: OutputStream) => { os.writeTag(new Tag(1, WireType.Fixed32)); });
  });

    // #[test]
    // fn test_output_stream_write_raw_little_endian32() {
    //     test_write("f1 e2 d3 c4", |os| os.write_raw_little_endian32(0xc4d3e2f1));
    // }

    // #[test]
    // fn test_output_stream_write_raw_little_endian64() {
    //     test_write("f1 e2 d3 c4 b5 a6 07 f8", |os| {
    //         os.write_raw_little_endian64(0xf807a6b5c4d3e2f1)
    //     });
    // }
});

function expectWrittenBytesField(bytes: Array<u8>, write: (w: Writer) => void): void {
  const buffer = new Array<u8>();
  const writer = new Writer(new OutputStream(buffer));
  write(writer);
  expect<Array<u8>>(buffer).toStrictEqual(bytes);
}

describe("Writer", () => {
  it("writeInt32", () => {
    expectWrittenBytesField(
      [0x08, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x01],
      (w: Writer) => { w.writeInt32(1, -1); },
    );
  });

  it("writeInt64", () => {
    expectWrittenBytesField(
      [0x08, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x01],
      (w: Writer) => { w.writeInt64(1, -1); },
    );
  });

  it("writeUint32", () => {
    expectWrittenBytesField(
      [0x08, 0x01],
      (w: Writer) => { w.writeUint32(1, 1); },
    );
  });

  it("writeUint64", () => {
    expectWrittenBytesField(
      [0x08, 0x01],
      (w: Writer) => { w.writeUint64(1, 1); },
    );
  });

  xit("writeSint32", () => {
    expectWrittenBytesField(
      [],
      (w: Writer) => { w.writeSint32(1, -1); },
    );
  });

  xit("writeSint64", () => {
    expectWrittenBytesField(
      [],
      (w: Writer) => { w.writeSint64(1, -1); },
    );
  });

  xit("writeFixed32", () => {
    expectWrittenBytesField(
      [],
      (w: Writer) => { w.writeFixed32(1, -1); },
    );
  });

  xit("writeFixed64", () => {
    expectWrittenBytesField(
      [],
      (w: Writer) => { w.writeFixed64(1, -1); },
    );
  });

  xit("writeSfixed32", () => {
    expectWrittenBytesField(
      [],
      (w: Writer) => { w.writeSfixed32(1, -1); },
    );
  });

  xit("writeSfixed64", () => {
    expectWrittenBytesField(
      [],
      (w: Writer) => { w.writeSfixed64(1, -1); },
    );
  });

  xit("writeFloat", () => {
    expectWrittenBytesField(
      [],
      (w: Writer) => { w.writeFloat(1, -1); },
    );
  });

  xit("writeDouble", () => {
    expectWrittenBytesField(
      [],
      (w: Writer) => { w.writeDouble(1, -1); },
    );
  });

  xit("writeBool", () => {
    expectWrittenBytesField(
      [],
      (w: Writer) => { w.writeBool(1, true); },
    );
  });

  xit("writeString", () => {
    expectWrittenBytesField(
      [],
      (w: Writer) => { w.writeInt32(1, -1); },
    );
  });

  xit("writeBytes", () => {
    expectWrittenBytesField(
      [],
      (w: Writer) => { w.writeInt32(1, -1); },
    );
  });
});

    // fn test_write<F>(expected: &str, mut gen: F)
    // where
    //     F: FnMut(&mut CodedOutputStream) -> ProtobufResult<()>,
    // {
    //     let expected_bytes = decode_hex(expected);

    //     // write to Write
    //     {
    //         let mut v = Vec::new();
    //         {
    //             let mut os = CodedOutputStream::new(&mut v as &mut dyn Write);
    //             gen(&mut os).unwrap();
    //             os.flush().unwrap();
    //         }
    //         assert_eq!(encode_hex(&expected_bytes), encode_hex(&v));
    //     }

    //     // write to &[u8]
    //     {
    //         let mut r = Vec::with_capacity(expected_bytes.len());
    //         r.resize(expected_bytes.len(), 0);
    //         {
    //             let mut os = CodedOutputStream::bytes(&mut r);
    //             gen(&mut os).unwrap();
    //             os.check_eof();
    //         }
    //         assert_eq!(encode_hex(&expected_bytes), encode_hex(&r));
    //     }

    //     // write to Vec<u8>
    //     {
    //         let mut r = Vec::new();
    //         r.extend(&[11, 22, 33, 44, 55, 66, 77]);
    //         {
    //             let mut os = CodedOutputStream::vec(&mut r);
    //             gen(&mut os).unwrap();
    //             os.flush().unwrap();
    //         }

    //         r.drain(..7);
    //         assert_eq!(encode_hex(&expected_bytes), encode_hex(&r));
    //     }
    // }

    // #[test]
    // fn test_output_stream_write_raw_byte() {
    //     test_write("a1", |os| os.write_raw_byte(0xa1));
    // }

    // #[test]
    // fn test_output_stream_write_tag() {
    //     test_write("08", |os| os.write_tag(1, wire_format::WireTypeVarint));
    // }

    // #[test]
    // fn test_output_stream_write_raw_bytes() {
    //     test_write("00 ab", |os| os.write_raw_bytes(&[0x00, 0xab]));

    //     let expected = repeat("01 02 03 04")
    //         .take(2048)
    //         .collect::<Vec<_>>()
    //         .join(" ");
    //     test_write(&expected, |os| {
    //         for _ in 0..2048 {
    //             os.write_raw_bytes(&[0x01, 0x02, 0x03, 0x04])?;
    //         }

    //         Ok(())
    //     });
    // }

    // #[test]
    // fn test_output_stream_write_raw_varint32() {
    //     test_write("96 01", |os| os.write_raw_varint32(150));
    //     test_write("ff ff ff ff 0f", |os| os.write_raw_varint32(0xffffffff));
    // }

    // #[test]
    // fn test_output_stream_write_raw_varint64() {
    //     test_write("96 01", |os| os.write_raw_varint64(150));
    //     test_write("ff ff ff ff ff ff ff ff ff 01", |os| {
    //         os.write_raw_varint64(0xffffffffffffffff)
    //     });
    // }

    // #[test]
    // fn test_output_stream_write_int32_no_tag() {
    //     test_write("ff ff ff ff ff ff ff ff ff 01", |os| {
    //         os.write_int32_no_tag(-1)
    //     });
    // }

    // #[test]
    // fn test_output_stream_write_int64_no_tag() {
    //     test_write("ff ff ff ff ff ff ff ff ff 01", |os| {
    //         os.write_int64_no_tag(-1)
    //     });
    // }

    // #[test]
    // fn test_output_stream_write_raw_little_endian32() {
    //     test_write("f1 e2 d3 c4", |os| os.write_raw_little_endian32(0xc4d3e2f1));
    // }

    // #[test]
    // fn test_output_stream_write_float_no_tag() {
    //     test_write("95 73 13 61", |os| os.write_float_no_tag(17e19));
    // }

    // #[test]
    // fn test_output_stream_write_double_no_tag() {
    //     test_write("40 d5 ab 68 b3 07 3d 46", |os| {
    //         os.write_double_no_tag(23e29)
    //     });
    // }

    // #[test]
    // fn test_output_stream_write_raw_little_endian64() {
    //     test_write("f1 e2 d3 c4 b5 a6 07 f8", |os| {
    //         os.write_raw_little_endian64(0xf807a6b5c4d3e2f1)
    //     });
    // }

    // #[test]
    // fn test_output_stream_io_write() {
    //     let expected = [0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77];

    //     // write to Write
    //     {
    //         let mut v = Vec::new();
    //         {
    //             let mut os = CodedOutputStream::new(&mut v as &mut dyn Write);
    //             Write::write(&mut os, &expected).expect("io::Write::write");
    //             Write::flush(&mut os).expect("io::Write::flush");
    //         }
    //         assert_eq!(expected, *v);
    //     }

    //     // write to &[u8]
    //     {
    //         let mut v = Vec::with_capacity(expected.len());
    //         v.resize(expected.len(), 0);
    //         {
    //             let mut os = CodedOutputStream::bytes(&mut v);
    //             Write::write(&mut os, &expected).expect("io::Write::write");
    //             Write::flush(&mut os).expect("io::Write::flush");
    //             os.check_eof();
    //         }
    //         assert_eq!(expected, *v);
    //     }

    //     // write to Vec<u8>
    //     {
    //         let mut v = Vec::new();
    //         {
    //             let mut os = CodedOutputStream::vec(&mut v);
    //             Write::write(&mut os, &expected).expect("io::Write::write");
    //             Write::flush(&mut os).expect("io::Write::flush");
    //         }
    //         assert_eq!(expected, *v);
    //     }
    // }
