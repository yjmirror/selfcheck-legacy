import { SchoolLevel, User } from '../types';
export declare type SchoolInfo = {
    orgCode: string;
    baseURL: string;
};
export declare function searchSchool({ school, area, }: User): Promise<SchoolInfo>;
export declare function inferSchoolLevel(name: string): SchoolLevel;
