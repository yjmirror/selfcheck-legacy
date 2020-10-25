import { apiPostRequest } from '../request';
import { User } from '../types';
import { SchoolInfo } from './searchSchool';
import { encrypt } from '../encrypt';

export async function findUser(
  { name, birthday }: User,
  { orgCode, baseURL }: SchoolInfo
) {
  const response = await findUserApi(
    {
      name: encrypt(name),
      birthday: encrypt(birthday),
      orgCode,
      loginType: 'school',
      stdntPNo: null,
    },
    baseURL
  );
  return response.data.token;
}

function findUserApi(payload: FindUserRequest, baseURL: string) {
  return apiPostRequest<FindUserRequest, FindUserResponse>(
    'v2/findUser',
    payload,
    {
      baseURL,
    }
  );
}

export interface FindUserRequest {
  orgCode: string;
  name: string;
  birthday: string;
  stdntPNo: null;
  loginType: string;
}
export interface FindUserResponse {
  orgName: string;
  admnYn: string;
  atptOfcdcConctUrl: string;
  mngrClassYn: string;
  pInfAgrmYn: string;
  userName: string;
  stdntYn: string;
  token: string;
  mngrDeptYn: string;
}
