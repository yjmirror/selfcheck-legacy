import { User } from './types';
import { API_TYPE } from './runtime/api';
export declare type SelfcheckResult = API_TYPE.SEND_SURVEY_RESULT;
export declare class SelfcheckError extends Error {
}
export declare class SelfcheckRuntimeError extends SelfcheckError {
}
export declare class SelfcheckNetworkError extends SelfcheckError {
}
/**
 * Selfcheck - 교육부 자가진단 자동화
 * @param user 이용자 정보
 */
declare function selfcheck(user: User): Promise<SelfcheckResult>;
export { User, User as HCSUser } from './types';
export { selfcheck as healthCheck, selfcheck, selfcheck as default, selfcheck as hcs, };
export { loadRuntime as manualUpdate, setRuntime as __UNSAFE_setRuntime, getRuntimeVersion, bundledRuntimeVersion, } from './runtimeLoader';
export { disableAutoUpdate, default as __UNSAFE_store } from './configStore';
