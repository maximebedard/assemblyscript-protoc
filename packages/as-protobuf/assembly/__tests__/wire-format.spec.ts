import { WireType, Tag, tryWireTypeFromU32 } from "../wire-format";

describe("tryWireTypeFromU32", () => {
  throws("when > 5", () => {
    tryWireTypeFromU32(6);
  });

  it("it returns the WireType", () => {
    expect<WireType>(tryWireTypeFromU32(0)).toBe(WireType.Varint);
    expect<WireType>(tryWireTypeFromU32(1)).toBe(WireType.Fixed64);
    expect<WireType>(tryWireTypeFromU32(2)).toBe(WireType.LengthDelimited);
    expect<WireType>(tryWireTypeFromU32(5)).toBe(WireType.Fixed32);
  });

  throws("StartGroup is not supported", () => {
    tryWireTypeFromU32(3);
  });

  throws("EndGroup is not supported", () => {
    tryWireTypeFromU32(4);
  });
});

describe("Tag.tryFromU32", () => {
  throws("when fieldNumber == 0", () => {
    Tag.tryFromU32(0);
  });

  throws("when fieldNumber > 0x1FFFFFFF", () => {
    Tag.tryFromU32(0);
  });

  it("returns a Tag", () => {
    const expected = new Tag(1, WireType.Fixed32);
    expect<Tag>(Tag.tryFromU32(13)).toBe(expected);
  });
});

describe("Tag", () => {
  it("value returns encoded as a u32", () => {
    const tag = new Tag(1, WireType.Fixed32);
    expect<u32>(tag.value()).toBe(13);
  });
})
