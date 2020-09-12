import { apiPostRequest } from '../request';
import { User } from '../types';
import { SchoolInfo } from './searchSchool';
import { encrypt } from '../encrypt';

export async function loginWithSchool(
  { name, birthday }: User,
  { orgCode, baseURL }: SchoolInfo
) {
  const response = await loginApi(
    { name: encrypt(name), birthday: encrypt(birthday), orgcode: orgCode },
    baseURL
  );
  return response.data.token;
}

function loginApi(payload: LoginPayload, baseURL: string) {
  return apiPostRequest<LoginPayload, LoginResponse>(
    '/loginwithschool',
    payload,
    {
      baseURL,
    }
  );
}
export type LoginResponse = {
  admnYn: string;
  orgname: string;
  mngrClassYn: string;
  name: string;
  man: string;
  stdntYn: string;
  infAgrmYn: string;
  token: string;
  mngrDeptYn: string;
};

export type LoginPayload = {
  birthday: string;
  name: string;
  orgcode: string;
};
