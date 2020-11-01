// window, navigator polyfill for nodejs
import './browser-polyfill'; // all import statements are hoisted

import { JSEncrypt } from 'jsencrypt';
import store from './configStore';

let encoder: JSEncrypt | null = null;

export function encrypt(payload: string) {
  if (!encoder) {
    encoder = new JSEncrypt();
    encoder.setPublicKey(store.publicKey);
  }
  return encoder.encrypt(payload);
}
