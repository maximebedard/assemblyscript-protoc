export function parse<T>(buffer: Uint8Array): T {
  return changetype<T>(0);
}

export * from "./reader";
export * from "./writer";
export * from "./utils";
