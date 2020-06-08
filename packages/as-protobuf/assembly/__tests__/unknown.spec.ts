import { UnknownValue, UnknownValueType } from "../";

describe("UnknownValue.fixed32", () => {
  it("returns a fixed32 value", () => {

  });
});

describe("UnknownValue.fixed64", () => {
  it("returns a fixed64 value", () => {

  });
});

describe("UnknownValue.varint", () => {
  it("returns a varint value", () => {

  });
});

describe("UnknownValue.lengthDelimited", () => {
  it("returns a lengthDelimited value", () => {

  });
});

describe("UnknownValue", () => {
  throws("asU32 throws when type is not Fixed32", () => {
    UnknownValue.fixed64(1337).asU32();
  });

  throws("asU64 throws when type is not Fixed64 or Varint", () => {
    UnknownValue.fixed32(1337).asU64();
  });

  throws("asBytes throws when type is not lengthDelimited", () => {
    UnknownValue.varint(1337).asBytes();
  });

})
