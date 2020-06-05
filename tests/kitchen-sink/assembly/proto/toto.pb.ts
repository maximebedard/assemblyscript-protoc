class PrimitivesTest {
  private a: f64 | null;
  private b: f32 | null;
  private c: i32 | null;
  private d: i64 | null;
  private e: u32 | null;
  private f: u64 | null;
  private g: i32 | null;
  private h: i64 | null;
  private i: u32 | null;
  private j: u64 | null;
  private k: i32 | null;
  private l: i64 | null;
  private m: bool | null;
  private n: string | null;
  private o: bool | null;

  geta(): f64 | null { return this.a; }
  seta(v: f64 | null) { this.a = v; }

  getb(): f32 | null { return this.b; }
  setb(v: f32 | null) { this.b = v; }

  getc(): i32 | null { return this.c; }
  setc(v: i32 | null) { this.c = v; }

  getd(): i64 | null { return this.d; }
  setd(v: i64 | null) { this.d = v; }

  gete(): u32 | null { return this.e; }
  sete(v: u32 | null) { this.e = v; }

  getf(): u64 | null { return this.f; }
  setf(v: u64 | null) { this.f = v; }

  getg(): i32 | null { return this.g; }
  setg(v: i32 | null) { this.g = v; }

  geth(): i64 | null { return this.h; }
  seth(v: i64 | null) { this.h = v; }

  geti(): u32 | null { return this.i; }
  seti(v: u32 | null) { this.i = v; }

  getj(): u64 | null { return this.j; }
  setj(v: u64 | null) { this.j = v; }

  getk(): i32 | null { return this.k; }
  setk(v: i32 | null) { this.k = v; }

  getl(): i64 | null { return this.l; }
  setl(v: i64 | null) { this.l = v; }

  getm(): bool | null { return this.m; }
  setm(v: bool | null) { this.m = v; }

  getn(): string | null { return this.n; }
  setn(v: string | null) { this.n = v; }

  geto(): bool | null { return this.o; }
  seto(v: bool | null) { this.o = v; }

}

class RepeatedTest {
  private i: Array<i32>;

  geti(): Array<i32> { return this.i; }
  seti(v: Array<i32>) { this.i = v; }

}

class NestingTest {

}

class Project {
  private a: i32 | null;

  geta(): i32 | null { return this.a; }
  seta(v: i32 | null) { this.a = v; }

}

class OneOfTest {
  private name: string | null;
  private sub_message: .Project | null;

  getname(): string | null { return this.name; }
  setname(v: string | null) { this.name = v; }

  getsub_message(): .Project | null { return this.sub_message; }
  setsub_message(v: .Project | null) { this.sub_message = v; }

}

class MapTest {
  private projects: Map<string | null, string | null>;

  getprojects(): Map<string | null, string | null> { return this.projects; }
  setprojects(v: Map<string | null, string | null>) { this.projects = v; }

}

class MapNestedValueTypeTest {
  private projects: Map<string | null, .Project | null>;

  getprojects(): Map<string | null, .Project | null> { return this.projects; }
  setprojects(v: Map<string | null, .Project | null>) { this.projects = v; }

}

class NestedEnumTest {
  private inner: InnerEnum | null;

  getinner(): InnerEnum | null { return this.inner; }
  setinner(v: InnerEnum | null) { this.inner = v; }

}

