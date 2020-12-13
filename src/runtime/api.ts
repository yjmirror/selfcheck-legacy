export const SEARCH_SCHOOL = '/v2/searchSchool';
export const FIND_USER = '/v2/findUser';
export const VALIDATE_PASSWORD = '/v2/validatePassword';
export const SEND_SURVEY_RESULT = '/registerServey';
export namespace API_TYPE {
  export type FIND_USER = {
    orgName: string;
    admnYn: string;
    atptOfcdcConctUrl: string;
    mngrClassYn: string;
    pInfAgrmYn: string;
    userName: string;
    stdntYn: string;
    token: string;
    mngrDeptYn: string;
  };
  export type SEND_SURVEY_RESULT = {
    registerDtm: string;
    inveYmd: string;
  };
  export type SEARCH_SCHOOL = {
    schulList: SchulList[];
    sizeover: boolean;
  };
}
type SchulList = {
  orgCode: string;
  kraOrgNm: string;
  engOrgNm: string;
  insttClsfCode: string;
  lctnScCode: string;
  lctnScNm: string;
  sigCode: string;
  juOrgCode: string;
  schulKndScCode: string;
  orgAbrvNm01: string;
  orgAbrvNm02: string;
  orgUon: string;
  updid: string;
  mdfcDtm: string;
  atptOfcdcConctUrl: string;
  addres: string;
};
