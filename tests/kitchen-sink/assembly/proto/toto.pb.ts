class PrimitivesTest {
  private a: f64;
  private b: f32;
  private c: i32;
  private d: i64;
  private e: u32;
  private f: u64;
  private g: i32;
  private h: i64;
  private i: u32;
  private j: u64;
  private k: i32;
  private l: i64;
  private m: bool;
  private n: string;
  private o: bool;

  geta(): f64 { return this.a; }
  seta(v: f64) { this.a = v; }

  getb(): f32 { return this.b; }
  setb(v: f32) { this.b = v; }

  getc(): i32 { return this.c; }
  setc(v: i32) { this.c = v; }

  getd(): i64 { return this.d; }
  setd(v: i64) { this.d = v; }

  gete(): u32 { return this.e; }
  sete(v: u32) { this.e = v; }

  getf(): u64 { return this.f; }
  setf(v: u64) { this.f = v; }

  getg(): i32 { return this.g; }
  setg(v: i32) { this.g = v; }

  geth(): i64 { return this.h; }
  seth(v: i64) { this.h = v; }

  geti(): u32 { return this.i; }
  seti(v: u32) { this.i = v; }

  getj(): u64 { return this.j; }
  setj(v: u64) { this.j = v; }

  getk(): i32 { return this.k; }
  setk(v: i32) { this.k = v; }

  getl(): i64 { return this.l; }
  setl(v: i64) { this.l = v; }

  getm(): bool { return this.m; }
  setm(v: bool) { this.m = v; }

  getn(): string { return this.n; }
  setn(v: string) { this.n = v; }

  geto(): bool { return this.o; }
  seto(v: bool) { this.o = v; }

}

class RepeatedTest {
  private i: Array<i32>;

  geti(): Array<i32> { return this.i; }
  seti(v: Array<i32>) { this.i = v; }

}

class NestingTest {

}

class Project {
  private a: i32;

  geta(): i32 { return this.a; }
  seta(v: i32) { this.a = v; }

}

class OneOfTest {
  private name: string;
  private sub_message: .Project | null;

  getname(): string { return this.name; }
  setname(v: string) { this.name = v; }

  getsub_message(): .Project | null { return this.sub_message; }
  setsub_message(v: .Project | null) { this.sub_message = v; }

}

class MapTest {
  private projects: Map<string, string>;

  getprojects(): Map<string, string> { return this.projects; }
  setprojects(v: Map<string, string>) { this.projects = v; }

}

class MapNestedValueTypeTest {
  private projects: Map<string, .Project | null>;

  getprojects(): Map<string, .Project | null> { return this.projects; }
  setprojects(v: Map<string, .Project | null>) { this.projects = v; }

}

class NestedEnumTest {
  private inner: InnerEnum | null;

  getinner(): InnerEnum | null { return this.inner; }
  setinner(v: InnerEnum | null) { this.inner = v; }

}

