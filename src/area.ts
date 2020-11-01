import { Area } from './types';

export function normalizeArea(area: string): Area {
  if (area.includes('남')) return toArea(area[0] + '남');
  else if (area.includes('북')) return toArea(area[0] + '북');
  else return toArea(area.slice(0, 2));
}
function toArea(area: string): Area {
  if (AREAS.includes(area)) return area as Area;
  else throw new Error(`Unexpected area "${area}"`);
}
const AREAS = [
  '서울',
  '부산',
  '대구',
  '인천',
  '광주',
  '대전',
  '울산',
  '세종',
  '경기',
  '강원',
  '충북',
  '충남',
  '전북',
  '전남',
  '경북',
  '경남',
  '제주',
];
