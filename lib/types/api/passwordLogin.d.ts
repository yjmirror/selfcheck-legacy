import { User } from '../types';
import { SchoolInfo } from './searchSchool';
export declare function passwordLogin(token: string, { password }: User, { baseURL }: SchoolInfo): Promise<GetUserInfoResponse>;
export interface ValidateUserRequest {
    password: string;
    deviceUuid: string;
}
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
export interface GetUserInfoRequest {
    orgCode: string;
    userPNo: string;
}
