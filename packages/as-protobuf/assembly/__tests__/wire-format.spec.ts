import { WireType, Tag, tryWireTypeFromU32 } from "../wire-format";

describe("tryWireTypeFromU32", () => {
  throws("it throws when > 5", () => {
    tryWireTypeFromU32(6)
  });

  it("it returns the WireType", () => {
    expect<WireType>(tryWireTypeFromU32(0)).toBe(WireType.Varint);
    expect<WireType>(tryWireTypeFromU32(1)).toBe(WireType.Fixed64);
    expect<WireType>(tryWireTypeFromU32(2)).toBe(WireType.LengthDelimited);
    expect<WireType>(tryWireTypeFromU32(3)).toBe(WireType.StartGroup);
    expect<WireType>(tryWireTypeFromU32(4)).toBe(WireType.EndGroup);
    expect<WireType>(tryWireTypeFromU32(5)).toBe(WireType.Fixed32);
  });
});


describe("Tag", () => {
  describe("tryFromU32", () => {

  });
});
