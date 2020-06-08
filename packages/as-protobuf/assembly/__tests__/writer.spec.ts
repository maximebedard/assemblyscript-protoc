import { Writer, Tag, WireType } from "../";

function expectWrittenBytes(bytes: u8[], write: (writer: Writer) => void): void {
  const buffer: u8[] = [];
  const writer = new Writer(buffer);
  write(writer);
  expect<u8[]>(buffer).toBe(bytes);
}

describe("Writer", () => {
  // it("writeUint8", () => {
  //   expectWrittenBytes(
  //     [0xA1],
  //     (writer: Writer) => { writer.writeUint8(0xA1); }
  //   );
  // });

  it("writeTag", () => {
    expectWrittenBytes(
      [0x08],
      (writer: Writer) => { writer.writeTag(new Tag(1, WireType.Varint)); }
    );
  });

  // it("writeVarint32", () => {
  //   expectWrittenBytes(
  //     [0x96, 0x01],
  //     (writer: Writer) => { writer.writeVarint32(150); }
  //   );

  //   expectWrittenBytes(
  //     [0xFF, 0xFF, 0xFF, 0xFF, 0x0F],
  //     (writer: Writer) => { writer.writeVarint32(0xffffffff as u32); }
  //   );
  // });

  // it("writeVarint64", () => {
  //   expectWrittenBytes(
  //     [0x96, 0x01],
  //     (writer: Writer) => { writer.writeVarint64(150); }
  //   );

  //   expectWrittenBytes(
  //     [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x01],
  //     (writer: Writer) => { writer.writeVarint64(0xffffffffffffffff as u64); }
  //   );
  // });

  // it("writeInt32", () => {
  //   expectWrittenBytes(
  //     [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x01],
  //     (writer: Writer) => { writer.writeInt32(-1); }
  //   );
  // });

  // it("writeInt64", () => {
  //   expectWrittenBytes(
  //     [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x01],
  //     (writer: Writer) => { writer.writeInt64(-1); }
  //   );
  // });

  // it("writeFloat", () => {
  //   expectWrittenBytes(
  //     [0x95, 0x73, 0x13, 0x61],
  //     (writer: Writer) => { writer.writeFloat(17e19); }
  //   );
  // });

  // it("writeDouble", () => {
  //   expectWrittenBytes(
  //     [0x40, 0xD5, 0xAB, 0x68, 0xB3, 0x07, 0x3D, 0x46],
  //     (writer: Writer) => { writer.writeDouble(23e29); }
  //   );
  // });

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
