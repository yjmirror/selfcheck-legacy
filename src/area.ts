import { Area } from './types';

export function normalizeArea(area: string): Area {
  if (area.includes('남')) return toArea(area[0] + '남');
  else if (area.includes('북')) return toArea(area[0] + '북');
  else return toArea(area.slice(0, 2));
}
function toArea(area: string): Area {
  return area as Area;
}
