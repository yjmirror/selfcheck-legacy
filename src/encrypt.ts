import NodeRSA from 'node-rsa';
import store from './configStore';
let encoder: NodeRSA | null = null;
export function encrypt(payload: string) {
  if (!encoder) encoder = loadKey(store.publicKey);
  return encoder.encrypt(payload, 'base64');
}

function loadKey(hex: string) {
  return new NodeRSA(Buffer.from(hex, 'hex'), 'pkcs8-public-der', {
    encryptionScheme: 'pkcs1',
  });
}
