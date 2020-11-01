import { User } from './types';
import { API_TYPE } from './runtime/api';
export declare type SelfcheckResult = API_TYPE.SEND_SURVEY_RESULT;
export declare class SelfcheckError extends Error {
}
/**
 * Selfcheck - 교육부 자가진단 자동화
 * @param user 이용자 정보
 * @param options 옵션
 */
declare function selfcheck(user: User): Promise<SelfcheckResult>;
export { User, User as HCSUser } from './types';
export { selfcheck as healthCheck, selfcheck, selfcheck as default, selfcheck as hcs, };
export { loadRuntime as manualUpdate } from './runtimeLoader';
export { disableAutoUpdate } from './configStore';
