import { encrypt as encryptNode } from './encrypt';
import { encrypt as encryptBrowser } from './encrypt.browser';

it('encodes string properly: node', () => {
  expect(encryptNode('홍길동')).toHaveLength(344);
});
it('encodes string properly: browser', () => {
  expect(encryptBrowser('홍길동')).toHaveLength(344);
});
