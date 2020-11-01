export const API_URL = {
  SEARCH_SCHOOL: '/v2/searchSchool',
  FIND_USER: '/v2/findUser',
  UPDATE_AGREEMENT: '/v2/updatePInfAgrmYn',
  HAS_PASSWORD: '/v2/hasPassword',
  REGISTER_PASSWORD: '/v2/registerPassword',
  LOGIN_WITH_SECOND_PASSWORD: '/v2/validatePassword',
  INIT_PASSWORD: '/v2/initPassword',
  SEND_SURVEY_RESULT: '/registerServey',
  SELECT_GROUP_LIST: '/v2/selectUserGroup',
  REFRESH_USER_INFO: '/v2/getUserInfo',
  REGISTER_GROUP_LIST: '/v2/insertUserInGroup',
  REMOVE_GROUP_LIST: '/v2/removeUserInGroup',
  TEACHER_CLASS_LIST: '/joinClassList',
  MANAGER_CLASS_LIST: '/joinDeptList',
  CLASS_JOIN_LIST: '/join',
  DEPT_JOIN_LIST: '/joinTchr',
  JOIN_DETAIL: '/joinDetail',
  SEND_PUSH: '/push',
  SELECT_NOTICE_LIST: '/v2/selectNoticeList',
  SELECT_NOTICE_CONTENTS: '/v2/selectNotice',
} as const;
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
