import NodeRSA from 'node-rsa';
import { PUBLIC_KEY_HEX } from './constants';

export function encrypt(payload: string) {
  const key = loadKey(PUBLIC_KEY_HEX);
  return key.encrypt(payload, 'base64');
}

function loadKey(hex: string) {
  return new NodeRSA(Buffer.from(hex, 'hex'), 'pkcs8-public-der', {
    encryptionScheme: 'pkcs1',
  });
}
