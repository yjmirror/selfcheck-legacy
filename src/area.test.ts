import { normalizeArea } from './area';

describe('area', () => {
  it('normalizes area', () => {
    expect(normalizeArea('부산')).toEqual('부산');
    expect(normalizeArea('서울시')).toEqual('서울');
    expect(normalizeArea('경북도')).toEqual('경북');
    expect(normalizeArea('제주도')).toEqual('제주');
    expect(normalizeArea('전라남도')).toEqual('전남');
    expect(normalizeArea('대전광역시')).toEqual('대전');
    expect(normalizeArea('세종특별자치시')).toEqual('세종');
  });

  it('throws error on unexpected input', () => {
    expect(() => normalizeArea('뉴욕시')).toThrowError();
    expect(() => normalizeArea('울롱도')).toThrowError();
  });
});
