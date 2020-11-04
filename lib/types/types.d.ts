export interface User {
    /**
     * 실명
     */
    name: string;
    /**
     * 학교명
     */
    school: string;
    /**
     * 지역명
     */
    area: string;
    /**
     * 생일 (YYMMDD)
     */
    birthday: string;
    /**
     * 자가진단 비밀번호 (선택)
     */
    password?: string;
}
export declare type Area = '서울' | '부산' | '대구' | '인천' | '광주' | '대전' | '울산' | '세종' | '경기' | '강원' | '충북' | '충남' | '전북' | '전남' | '경북' | '경남' | '제주';
export declare type AreaCode = '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '10' | '11' | '12' | '13' | '14' | '15' | '16' | '17' | '18';
export declare type SurveyResponse = {
    registerDtm: string;
    inveYmd: string;
};
