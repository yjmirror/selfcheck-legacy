import { User } from './types';
export declare type SelfcheckOptions = {
    delay?: number;
    userAgent?: string;
};
/**
 * Selfcheck - 교육부 자가진단 자동화
 * @param user 이용자 정보
 * @param options 옵션
 */
declare function selfcheck(user: User, options?: SelfcheckOptions): Promise<import("./api").SurveyResponse>;
export { SurveyResponse as SelfcheckResult, User, User as HCSUser, } from './types';
export { selfcheck as healthCheck, selfcheck, selfcheck as default, selfcheck as hcs, };
