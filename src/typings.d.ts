declare module 'jsencrypt' {
  export class JSEncrypt {
    constructor();
    setPublicKey(pk: string): void;
    encrypt(key: string): string;
  }
}
