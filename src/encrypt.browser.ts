// window, navigator polyfill for nodejs
import './browser-polyfill'; // all import statements are hoisted

import { JSEncrypt } from 'jsencrypt';
import { PUBLIC_KEY_HEX } from './constants';

let encoder: JSEncrypt | null = null;

export function encrypt(payload: string) {
  if (!encoder) {
    encoder = new JSEncrypt();
    encoder.setPublicKey(PUBLIC_KEY_HEX);
  }
  return encoder.encrypt(payload);
}
