import { apiPostRequest } from '../request';
import { User } from '../types';
import { SchoolInfo } from './searchSchool';
import { encrypt } from '../encrypt';

export async function secondLogin(
  token: string,
  { password }: User,
  { baseURL }: SchoolInfo
) {
  const config = { baseURL, token };
  await checkPwApi(config);
  await secondLoginApi({ password: encrypt(password), deviceUuid: '' }, config);
  const {
    data: { groupList },
  } = await selectGroupApi(config);
  const [{ userPNo, orgCode }] = groupList;
  await userRefreshApi({ userPNo, orgCode }, config);
}

function secondLoginApi(
  payload: LoginPayload,
  config: { token: string; baseURL: string }
) {
  return apiPostRequest<LoginPayload, LoginResponse>(
    '/secondlogin',
    payload,
    config
  );
}

function checkPwApi(config: { token: string; baseURL: string }) {
  return apiPostRequest<{}, LoginResponse>('/checkpw', {}, config);
}

function userRefreshApi(
  payload: UserRefreshPayload,
  config: { token: string; baseURL: string }
) {
  return apiPostRequest<UserRefreshPayload, UserRefreshResponse>(
    '/userrefresh',
    payload,
    config
  );
}

function selectGroupApi(config: { token: string; baseURL: string }) {
  return apiPostRequest<{}, SelectGroupResponse>(
    '/selectGroupList',
    {},
    config
  );
}

export interface UserRefreshPayload {
  orgCode: string;
  userPNo: string;
}

export interface UserRefreshResponse {
  UserInfo: {
    orgCode: string;
    orgName: string;
    userPNo: string;
    userNameEncpt: string;
    stdntYn: YN;
    mngrYn: YN;
    mngrClassYn: YN;
    mngrDeptYn: YN;
    schulCrseScCode: string;
    lctnScCode: string;
    token: string;
    atptOfcdcConctUrl: string;
    registerDtm: string;
    registerYmd: string;
    isHealthy: boolean;
    pInfAgrmYn: YN;
    admnYn: YN;
    lockYn: YN;
    wrongPassCnt: number;
  };
}

export type LoginResponse = { sndLogin: { existsYn: YN; validYn: YN } };

export type LoginPayload = {
  deviceUuid: string;
  password: string;
};

export interface SelectGroupResponse {
  groupList: GroupList[];
}

export interface GroupList {
  orgCode: string;
  orgName: string;
  userPNo: string;
  userNameEncpt: string;
  stdntYn: YN;
  mngrYn: YN;
  schulCrseScCode: string;
  lctnScCode: string;
  token: string;
  atptOfcdcConctUrl: string;
  wrongPassCnt: number;
  otherYn: YN;
}
export type YN = 'Y' | 'N';
