import { User } from '../types';
import { HOST_API_TYPE } from '../hostApi';
import { API_TYPE, SEARCH_SCHOOL, SEND_SURVEY_RESULT, FIND_USER } from './api';
import { getAreaCode, normalizeArea } from './area';

type SchoolInfo = { orgCode$_$: string; baseURL$_$: string };

declare const __HOST_API: HOST_API_TYPE;

function initialize(user: User) {
  const { school, area, name, birthday } = user;
  let schoolInfo: SchoolInfo;
  let token: string;

  async function searchSchool$_$() {
    const {
      schulList: [{ orgCode, atptOfcdcConctUrl }],
    } = await __HOST_API.get<API_TYPE.SEARCH_SCHOOL>(SEARCH_SCHOOL, {
      params: {
        schulCrseScCode: inferSchoolLevel(school),
        lctnScCode: getAreaCode(normalizeArea(area)),
        orgName: school,
        currentPageNo: 1,
      },
      baseURL: 'hcs.eduro.go.kr',
    });
    schoolInfo = {
      orgCode$_$: orgCode,
      baseURL$_$: atptOfcdcConctUrl,
    };
  }

  async function getToken$_$() {
    const { orgCode$_$: orgCode, baseURL$_$: baseURL } = schoolInfo;
    const request = {
      name: __HOST_API.encrypt(name),
      birthday: __HOST_API.encrypt(birthday),
      orgCode,
      loginType: 'school',
      stdntPNo: null,
    };
    const resp = await __HOST_API.post<API_TYPE.FIND_USER>(FIND_USER, request, {
      baseURL,
    });
    token = resp.token;
    return token;
  }

  async function sendRequest$_$() {
    const request = {
      deviceUuid: '',
      rspns00: 'Y',
      rspns01: '1',
      rspns02: '1',
      rspns03: null,
      rspns04: null,
      rspns05: null,
      rspns06: null,
      rspns07: null,
      rspns08: null,
      rspns09: '0',
      rspns10: null,
      rspns11: null,
      rspns12: null,
      rspns13: null,
      rspns14: null,
      rspns15: null,
      upperToken: token,
      upperUserNameEncpt: name,
    };

    return await __HOST_API.post<API_TYPE.SEND_SURVEY_RESULT>(
      SEND_SURVEY_RESULT,
      request,
      { baseURL: schoolInfo.baseURL$_$, token }
    );
  }

  return {
    searchSchool$_$,
    sendRequest$_$,
    getToken$_$,
  };
}

function inferSchoolLevel(name: string) {
  const SCHOOL_LEVEL_유치원 = '1';
  const SCHOOL_LEVEL_초등학교 = '2';
  const SCHOOL_LEVEL_중학교 = '3';
  const SCHOOL_LEVEL_고등학교 = '4';
  const SCHOOL_LEVEL_특수학교 = '5';
  if (name.endsWith('학교')) {
    if (name.endsWith('초등학교')) return SCHOOL_LEVEL_초등학교;
    else if (name.endsWith('중학교')) return SCHOOL_LEVEL_중학교;
    else if (name.endsWith('고등학교')) return SCHOOL_LEVEL_고등학교;
    return SCHOOL_LEVEL_특수학교;
  } else {
    const lastChar = name[name.length - 1];
    if (lastChar === '초') return SCHOOL_LEVEL_초등학교;
    else if (lastChar === '중') return SCHOOL_LEVEL_중학교;
    else if (lastChar === '고') return SCHOOL_LEVEL_고등학교;
    else if (name.includes('유치') || lastChar === '집')
      return SCHOOL_LEVEL_유치원;
    else throw new Error('unexpected school name');
  }
}

export default async (user: User) => {
  const { searchSchool$_$, sendRequest$_$, getToken$_$ } = initialize(user);
  try {
    await searchSchool$_$();
    await getToken$_$();
    return sendRequest$_$();
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export async function validate(user: User) {
  const { searchSchool$_$, getToken$_$ } = initialize(user);
  try {
    await searchSchool$_$();
    const token = await getToken$_$();
    if (token.length > 1) return true;
    else return false;
  } catch {
    return false;
  }
}
