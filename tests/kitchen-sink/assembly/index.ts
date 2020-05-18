// The entry file of your WebAssembly module.
class Foo {
  public _a: u16;
  public _b: u32;
}

namespace Foo {
  class Bar {
    public _c: u16;

    constructor() {
      this._c = 1337;
    }
  }
}

export function add(a: i32, b: i32): i32 {
  let c = new Foo.Bar();

  return a + b;
}
