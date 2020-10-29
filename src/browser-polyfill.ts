//@ts-ignore
// polyfill for running jsencrypt in node

if (typeof globalThis.window === 'undefined') globalThis.window = globalThis;
if (typeof globalThis.navigator === 'undefined')
  globalThis.navigator = {} as typeof navigator;
