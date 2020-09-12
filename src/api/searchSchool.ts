import { apiGetRequest, defaultBaseURL } from '../request';
import { AreaCode, SchoolLevelCode, SchoolLevel, User } from '../types';
import { SCHOOL_LEVEL_TABLE, AREA_CODE_TABLE } from '../constants';
import { normalizeArea } from '../area';

export type SchoolInfo = { orgCode: string; baseURL: string };

export async function searchSchool({
  school,
  area,
}: User): Promise<SchoolInfo> {
  const schoolLevelCode = SCHOOL_LEVEL_TABLE[inferSchoolLevel(school)];
  const areaCode = AREA_CODE_TABLE[normalizeArea(area)];
  const {
    data: {
      schulList: [result],
    },
  } = await searchSchoolApi({
    schulCrseScCode: schoolLevelCode,
    lctnScCode: areaCode,
    orgName: school,
    currentPageNo: 1,
  });
  return {
    orgCode: result.orgCode,
    baseURL: result.atptOfcdcConctUrl,
  };
}

export function inferSchoolLevel(name: string): SchoolLevel {
  if (name.endsWith('학교')) {
    if (name.endsWith('초등학교')) return '초등학교';
    else if (name.endsWith('중학교')) return '중학교';
    else if (name.endsWith('고등학교')) return '고등학교';
    return '특수학교';
  } else {
    const lastChar = name[name.length - 1];
    if (lastChar === '초') return '초등학교';
    else if (lastChar === '중') return '중학교';
    else if (lastChar === '고') return '고등학교';
    else if (name.includes('유치') || lastChar === '집') return '유치원';
    else throw new Error('unexpected school name');
  }
}

function searchSchoolApi(params: SchoolParams) {
  return apiGetRequest<SchoolResponse>('/school', {
    params,
    baseURL: defaultBaseURL,
  });
}

type SchulList = {
  orgCode: string;
  kraOrgNm: string;
  engOrgNm: string;
  insttClsfCode: string;
  lctnScCode: string;
  lctnScNm: string;
  sigCode: string;
  juOrgCode: string;
  schulKndScCode: string;
  orgAbrvNm01: string;
  orgAbrvNm02: string;
  orgUon: string;
  updid: string;
  mdfcDtm: string;
  atptOfcdcConctUrl: string;
  addres: string;
};

type SchoolResponse = {
  schulList: SchulList[];
  sizeover: boolean;
};

type SchoolParams = {
  lctnScCode: AreaCode;
  currentPageNo: number;
  schulCrseScCode: SchoolLevelCode;
  orgName: string;
};
