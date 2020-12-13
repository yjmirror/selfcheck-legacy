import type { User } from '..';
import { HOST_API_TYPE } from '../runtimeHost';
import {
  API_TYPE,
  SEARCH_SCHOOL,
  SEND_SURVEY_RESULT,
  FIND_USER,
  VALIDATE_PASSWORD,
} from './api';
import {
  getAreaCode,
  normalizeArea,
  inferSchoolLevel,
  normalizeUrl,
} from './util';

declare const __HOST_API: HOST_API_TYPE;
declare const __RUNTIME_VERSION__: string;
export const version = __RUNTIME_VERSION__;

const { crypto, axios, Buffer, SelfcheckError } = __HOST_API;

function initialize(user: User) {
  const instance = axios.create({
    headers: {
      post: {
        'Sec-Fetch-Site': 'same-site',
      },
      common: {
        Accept: 'application/json, text/plain, */*',
        'Accept-Encoding': `gzip, deflate, br`,
        'Accept-Language': `ko-KR,ko;q=0.9`,
        'Cache-Control': `no-cache`,
        Connection: `keep-alive`,
        Pragma: `no-cache`,
        Referer: `https"://hcs.eduro.go.kr/`,
        'sec-ch-ua': `"Google Chrome";v="87", "\"Not;A\\Brand";v="99", "Chromium";v="87"`,
        'sec-ch-ua-mobile': `?0`,
        'Sec-Fetch-Dest': `empty`,
        'Sec-Fetch-Mode': `cors`,
        'Sec-Fetch-Site': `same-origin`,
        'User-Agent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36`,
        'X-Requested-With': `XMLHttpRequest`,
      },
    },
  });
  const { school, area, name, birthday, password } = user;
  let orgCode: string;
  let token: string;

  async function searchSchool$_$() {
    const { data } = await instance.get<API_TYPE.SEARCH_SCHOOL>(SEARCH_SCHOOL, {
      params: {
        schulCrseScCode: inferSchoolLevel(school),
        lctnScCode: getAreaCode(normalizeArea(area)),
        orgName: school,
        loginType: 'school',
      },
      baseURL: 'https://hcs.eduro.go.kr',
    });
    if (!data || !data.schulList || !data.schulList.length) {
      throw new SelfcheckError('cannot find school');
    }
    const schoolItem = data.schulList[0];
    instance.defaults.baseURL = normalizeUrl(schoolItem.atptOfcdcConctUrl);
    orgCode = schoolItem.orgCode;
    return orgCode;
  }

  async function findUser$_$() {
    const request = {
      name: encrypt(name),
      birthday: encrypt(birthday),
      orgCode,
      loginType: 'school',
    };
    const r = await instance.post<API_TYPE.FIND_USER>(FIND_USER, request);
    if (!r.data || !r.data.token)
      throw new SelfcheckError('cannot find school');
    const tempToken = r.data.token;

    const pw = await instance.post<string>(
      VALIDATE_PASSWORD,
      {
        deviceUuid: '',
        password: encrypt(password),
      },
      {
        headers: {
          Authorization: tempToken,
        },
      }
    );
    token = pw.data;

    instance.defaults.headers.common['Authorization'] = token;
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

    const { data } = await instance.post<API_TYPE.SEND_SURVEY_RESULT>(
      SEND_SURVEY_RESULT,
      request
    );
    if (data && data.registerDtm) return data;
    else throw new SelfcheckError('abnormal response from server');
  }

  return {
    searchSchool$_$,
    sendRequest$_$,
    findUser$_$,
  };
}

export default async (user: User) => {
  const { searchSchool$_$, sendRequest$_$, findUser$_$ } = initialize(user);
  try {
    await searchSchool$_$();
    await findUser$_$();
    return await sendRequest$_$();
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export async function validate(user: User) {
  const { searchSchool$_$, findUser$_$ } = initialize(user);
  try {
    await searchSchool$_$();
    const token = await findUser$_$();
    if (token.length > 1) return true;
    else return false;
  } catch {
    return false;
  }
}

const publicKey = `-----BEGIN RSA PUBLIC KEY-----
MIIBCgKCAQEA81dCnCKt0NVH7j5Oh2+SGgEU0aqi5u6sYXemouJWXOlZO3jqDsHY
M1qfEjVvCOmeoMNFXYSXdNhflU7mjWP8jWUmkYIQ8o3FGqMzsMTNxr+bAp0cULWu
9eYmycjJwWIxxB7vUwvpEUNicgW7v5nCwmF5HS33Hmn7yDzcfjfBs99K5xJEppHG
0qc+q3YXxxPpwZNIRFn0Wtxt0Muh1U8avvWyw03uQ/wMBnzhwUC8T4G5NclLEWzO
QExbQ4oDlZBv8BM/WxxuOyu0I8bDUDdutJOfREYRZBlazFHvRKNNQQD2qDfjRz48
4uFs7b5nykjaMB9k/EJAuHjJzGs9MMMWtQIDAQAB
-----END RSA PUBLIC KEY-----`;

function encrypt(payload: string) {
  return crypto
    .publicEncrypt(
      { key: publicKey, padding: crypto.constants.RSA_PKCS1_PADDING },
      Buffer.from(payload)
    )
    .toString('base64');
}
