declare module 'jsencrypt' {
  export class JSEncrypt {
    constructor();
    setPublicKey(pk: string): void;
    encrypt(key: string): string;
  }
}

declare module 'debug/src/node' {
  import debug from 'debug';
  export = debug;
}
declare module 'debug/src/browser' {
  import debug from 'debug';
  export = debug;
}
