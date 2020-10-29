import { User } from '../types';
import { SchoolInfo } from './searchSchool';
export declare function findUser({ name, birthday }: User, { orgCode, baseURL }: SchoolInfo): Promise<string>;
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
