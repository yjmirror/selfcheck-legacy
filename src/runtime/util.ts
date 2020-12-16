export function normalizeArea(area: string): Area {
  for (const char of '남북') {
    if (area.includes(char)) return toArea(area[0] + char);
  }
  return toArea(area.slice(0, 2));
}

export function normalizeUrl(url: string) {
  if (url.startsWith('http')) return url;
  else return `https://${url}`;
}

export function getAreaCode(a: Area) {
  return ({
    서울: '01',
    부산: '02',
    대구: '03',
    인천: '04',
    광주: '05',
    대전: '06',
    울산: '07',
    세종: '08',
    경기: 10,
    강원: 11,
    충북: 12,
    충남: 13,
    전북: 14,
    전남: 15,
    경북: 16,
    경남: 17,
    제주: 18,
  } as const)[a];
}

function toArea(area: string): Area {
  return area as Area;
}

export function inferSchoolLevel(name: string) {
  const idx = name.length - (name.endsWith('학교') ? 3 : 1);

  const table = {
    원: /*유치원*/ 1,
    초: /*초등학교*/ 2,
    중: /*중학교*/ 3,
    고: /*고등학교*/ 4,
  };
  return (
    table[name[idx] as keyof typeof table] ||
    table[name[idx - 1] as keyof typeof table] ||
    /*특수학교*/ 5
  );
}

type Area =
  | '서울'
  | '부산'
  | '대구'
  | '인천'
  | '광주'
  | '대전'
  | '울산'
  | '세종'
  | '경기'
  | '강원'
  | '충북'
  | '충남'
  | '전북'
  | '전남'
  | '경북'
  | '경남'
  | '제주';
