import * as Api from '../';

describe("primitives", () => {
  it("exports a type with all the primitives as field members", () => {
    let o = new Api.PrimitivesTest();

    expect(o.getA()).toBe(<>);
    expect(o.getB()).toBe(<>);
    expect(o.getC()).toBe(<>);
    expect(o.getD()).toBe(<>);
    expect(o.getE()).toBe(<>);
    expect(o.getF()).toBe(<>);
    expect(o.getG()).toBe(<>);
    expect(o.getH()).toBe(<>);
    expect(o.getI()).toBe(<>);
    expect(o.getJ()).toBe(<>);
    expect(o.getK()).toBe(<>);
    expect(o.getL()).toBe(<>);
    expect(o.getM()).toBe(<>);
    expect(o.getN()).toBe(<>);
  });
});

describe("user defined enum", () => {
  it("is exported under a custom namespace", () => {

  });

  it("is exported", () => {

  });
});

describe("user defined type", () => {
  it("is exported", () => {

  });

  it("is exported under a custom namespace", () => {

  });
});


describe("oneof", () => {

});

describe("map", () => {

});
