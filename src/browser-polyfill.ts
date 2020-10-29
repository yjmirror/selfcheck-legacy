//@ts-ignore
// polyfill for running jsencrypt in node
globalThis.window = globalThis;
globalThis.navigator =
  typeof navigator === 'undefined' ? ({} as typeof navigator) : navigator;
