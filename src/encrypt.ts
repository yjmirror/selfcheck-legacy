import NodeRSA from 'node-rsa';
import { PUBLIC_KEY_HEX } from './constants';
let encoder: NodeRSA | null = null;
export function encrypt(payload: string) {
  if (!encoder) encoder = loadKey(PUBLIC_KEY_HEX);
  return encoder.encrypt(payload, 'base64');
}

function loadKey(hex: string) {
  return new NodeRSA(Buffer.from(hex, 'hex'), 'pkcs8-public-der', {
    encryptionScheme: 'pkcs1',
  });
}
