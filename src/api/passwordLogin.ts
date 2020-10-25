import { apiPostRequest } from '../request';
import { User } from '../types';
import { SchoolInfo } from './searchSchool';
import { encrypt } from '../encrypt';

export async function passwordLogin(
  token: string,
  { password }: User,
  { baseURL }: SchoolInfo
) {
  const config = { baseURL, token };
  await validateUser({ password: encrypt(password), deviceUuid: '' }, config);
  const {
    data: { orgCode, userPNo },
  } = await selectGroupApi(config);
  const { data } = await getUserInfoApi(
    { orgCode, userPNo },
    { baseURL, token }
  );
  return data;
}

function validateUser(
  payload: ValidateUserRequest,
  config: { token: string; baseURL: string }
) {
  return apiPostRequest<ValidateUserRequest, ValidateUserResponse>(
    '/v2/validatePassword',
    payload,
    config
  );
}

function getUserInfoApi(
  payload: GetUserInfoRequest,
  config: { token: string; baseURL: string }
) {
  return apiPostRequest<GetUserInfoRequest, GetUserInfoResponse>(
    '/v2/getUserInfo',
    payload,
    config
  );
}

function selectGroupApi(config: { token: string; baseURL: string }) {
  return apiPostRequest<{}, SelectGroupResponse>(
    '/v2/selectUserGroup',
    {},
    config
  );
}

export interface ValidateUserRequest {
  password: string;
  deviceUuid: string;
}
type ValidateUserResponse = boolean;
// Generated by https://quicktype.io

export interface SelectGroupResponse {
  orgCode: string;
  orgName: string;
  userPNo: string;
  userNameEncpt: string;
  stdntYn: string;
  mngrYn: string;
  schulCrseScCode: string;
  lctnScCode: string;
  token: string;
  atptOfcdcConctUrl: string;
  wrongPassCnt: number;
  otherYn: string;
}
// Generated by https://quicktype.io

export interface GetUserInfoResponse {
  orgCode: string;
  orgName: string;
  userPNo: string;
  userNameEncpt: string;
  userName: string;
  stdntYn: string;
  mngrClassYn: string;
  mngrDeptYn: string;
  schulCrseScCode: string;
  lctnScCode: string;
  insttClsfCode: string;
  token: string;
  atptOfcdcConctUrl: string;
  pInfAgrmYn: string;
  admnYn: string;
  lockYn: string;
  wrongPassCnt: number;
}
// Generated by https://quicktype.io

export interface GetUserInfoRequest {
  orgCode: string;
  userPNo: string;
}