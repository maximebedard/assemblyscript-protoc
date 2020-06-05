// Wrapper type to make primitives nullable.
export class Box<T> {
  inner: T

  constructor(v: T) {
    this.inner = v;
  }
}
