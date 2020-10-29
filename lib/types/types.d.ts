export interface User {
    name: string;
    school: string;
    area: string;
    birthday: string;
    password: string;
}
export declare type Area = '서울' | '부산' | '대구' | '인천' | '광주' | '대전' | '울산' | '세종' | '경기' | '강원' | '충북' | '충남' | '전북' | '전남' | '경북' | '경남' | '제주';
export declare type AreaCode = '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '10' | '11' | '12' | '13' | '14' | '15' | '16' | '17' | '18';
export declare type SchoolLevel = '유치원' | '초등학교' | '중학교' | '고등학교' | '특수학교';
export declare type SchoolLevelCode = '1' | '2' | '3' | '4' | '5';
export declare type SurveyResponse = {
    registerDtm: string;
    inveYmd: string;
};
