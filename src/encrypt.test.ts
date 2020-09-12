import { encrypt } from './encrypt';

it('encodes string properly', () => {
  expect(encrypt('홍길동')).toHaveLength(344);
});
