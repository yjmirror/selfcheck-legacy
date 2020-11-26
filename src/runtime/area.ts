export function normalizeArea(area: string): Area {
  if (area.includes('남')) return toArea(area[0] + '남');
  else if (area.includes('북')) return toArea(area[0] + '북');
  else return toArea(area.slice(0, 2));
}

export function getAreaCode(a: Area): AreaCode {
  return ({
    서울: '01',
    부산: '02',
    대구: '03',
    인천: '04',
    광주: '05',
    대전: '06',
    울산: '07',
    세종: '08',
    경기: '10',
    강원: '11',
    충북: '12',
    충남: '13',
    전북: '14',
    전남: '15',
    경북: '16',
    경남: '17',
    제주: '18',
  } as const)[a];
}

function toArea(area: string): Area {
  return area as Area;
}
export type Area =
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

export type AreaCode =
  | '01'
  | '02'
  | '03'
  | '04'
  | '05'
  | '06'
  | '07'
  | '08'
  | '10'
  | '11'
  | '12'
  | '13'
  | '14'
  | '15'
  | '16'
  | '17'
  | '18';
