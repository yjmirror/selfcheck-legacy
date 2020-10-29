import { SchoolInfo } from './searchSchool';
import { GetUserInfoResponse } from './passwordLogin';
export declare function sendSurvey(token: string, { userNameEncpt }: GetUserInfoResponse, info: SchoolInfo): Promise<SurveyResponse>;
export declare type SurveyResponse = {
    registerDtm: string;
    inveYmd: string;
};
export interface SendSurveyRequest {
    rspns01: string;
    rspns02: string;
    rspns03: null;
    rspns04: null;
    rspns05: null;
    rspns06: null;
    rspns07: string;
    rspns08: string;
    rspns09: string;
    rspns10: null;
    rspns11: null;
    rspns12: null;
    rspns13: null;
    rspns14: null;
    rspns15: null;
    rspns00: string;
    deviceUuid: string;
    upperToken: string;
    upperUserNameEncpt: string;
}
