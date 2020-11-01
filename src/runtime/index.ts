import { Area, User, SchoolLevel } from '../types';
import { ContextType } from '../context';
import { API_TYPE, API_URL } from './api';
import { normalizeArea } from '../area';
type SchoolInfo = { orgCode: string; baseURL: string };

class Runtime {
  ctx: ContextType;
  user: User;
  token!: string;
  schoolInfo!: SchoolInfo;
  constructor(user: User, ctx: ContextType) {
    this.ctx = ctx;
    this.user = user;
  }
  async searchSchool() {
    const { school, area } = this.user;

    const {
      schulList: [{ orgCode, atptOfcdcConctUrl }],
    } = await this.ctx.get<API_TYPE.SEARCH_SCHOOL>(API_URL.SEARCH_SCHOOL, {
      params: {
        schulCrseScCode: getSchoolLevelCode(inferSchoolLevel(school)),
        lctnScCode: getAreaCode(normalizeArea(area)),
        orgName: school,
        currentPageNo: 1,
      },
      baseURL: defaultBaseURL,
    });
    this.schoolInfo = { orgCode, baseURL: atptOfcdcConctUrl };
  }

  async getToken() {
    const { name, birthday } = this.user;
    const { orgCode, baseURL } = this.schoolInfo;
    const request = {
      name: this.ctx.encrypt(name),
      birthday: this.ctx.encrypt(birthday),
      orgCode,
      loginType: 'school',
      stdntPNo: null,
    };
    const { token } = await this.ctx.post<API_TYPE.FIND_USER>(
      API_URL.FIND_USER,
      request,
      {
        baseURL,
      }
    );

    this.token = token;
  }
  async sendSurvey() {
    const request = {
      deviceUuid: '',
      rspns00: 'Y',
      rspns01: '1',
      rspns02: '1',
      rspns03: null,
      rspns04: null,
      rspns05: null,
      rspns06: null,
      rspns07: '0',
      rspns08: '0',
      rspns09: '0',
      rspns10: null,
      rspns11: null,
      rspns12: null,
      rspns13: null,
      rspns14: null,
      rspns15: null,
      upperToken: this.token,
      upperUserNameEncpt: this.user.name,
    };
    return await this.ctx.post<API_TYPE.SEND_SURVEY_RESULT>(
      API_URL.SEND_SURVEY_RESULT,
      request,
      { baseURL: this.schoolInfo.baseURL, token: this.token }
    );
  }
}

function inferSchoolLevel(name: string): SchoolLevel {
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
function getSchoolLevelCode(s: SchoolLevel) {
  return {
    유치원: '1',
    초등학교: '2',
    중학교: '3',
    고등학교: '4',
    특수학교: '5',
  }[s];
}

function getAreaCode(a: Area) {
  return {
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
  }[a];
}

export default async (user: User, ctx: ContextType) => {
  const rt = new Runtime(user, ctx);
  try {
    await rt.searchSchool();
    console.log(rt.schoolInfo);
    await rt.getToken();
    console.log(rt.token);
    return rt.sendSurvey();
  } catch (e) {
    console.error(e);
    throw e;
  }
};
const defaultBaseURL = 'hcs.eduro.go.kr';
