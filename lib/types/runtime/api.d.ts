export declare const SEARCH_SCHOOL = "/v2/searchSchool";
export declare const FIND_USER = "/v2/findUser";
export declare const SEND_SURVEY_RESULT = "/registerServey";
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
