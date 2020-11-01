export declare const API_URL: {
    readonly SEARCH_SCHOOL: "/v2/searchSchool";
    readonly FIND_USER: "/v2/findUser";
    readonly UPDATE_AGREEMENT: "/v2/updatePInfAgrmYn";
    readonly HAS_PASSWORD: "/v2/hasPassword";
    readonly REGISTER_PASSWORD: "/v2/registerPassword";
    readonly LOGIN_WITH_SECOND_PASSWORD: "/v2/validatePassword";
    readonly INIT_PASSWORD: "/v2/initPassword";
    readonly SEND_SURVEY_RESULT: "/registerServey";
    readonly SELECT_GROUP_LIST: "/v2/selectUserGroup";
    readonly REFRESH_USER_INFO: "/v2/getUserInfo";
    readonly REGISTER_GROUP_LIST: "/v2/insertUserInGroup";
    readonly REMOVE_GROUP_LIST: "/v2/removeUserInGroup";
    readonly TEACHER_CLASS_LIST: "/joinClassList";
    readonly MANAGER_CLASS_LIST: "/joinDeptList";
    readonly CLASS_JOIN_LIST: "/join";
    readonly DEPT_JOIN_LIST: "/joinTchr";
    readonly JOIN_DETAIL: "/joinDetail";
    readonly SEND_PUSH: "/push";
    readonly SELECT_NOTICE_LIST: "/v2/selectNoticeList";
    readonly SELECT_NOTICE_CONTENTS: "/v2/selectNotice";
};
export declare namespace API_TYPE {
    type FIND_USER = {
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
    type SEND_SURVEY_RESULT = {
        registerDtm: string;
        inveYmd: string;
    };
    type SEARCH_SCHOOL = {
        schulList: SchulList[];
        sizeover: boolean;
    };
}
declare type SchulList = {
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
export {};
