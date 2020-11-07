import { loadRuntime } from './runtimeLoader';
import { User } from './types';
import store from './configStore';
import { context } from './context';
import { API_TYPE } from './runtime/api';

export type SelfcheckResult = API_TYPE.SEND_SURVEY_RESULT;
export class SelfcheckError extends Error {}
export class SelfcheckRuntimeError extends SelfcheckError {}
export class SelfcheckNetworkError extends SelfcheckError {}
/**
 * Selfcheck - 교육부 자가진단 자동화
 * @param user 이용자 정보
 */
async function selfcheck(user: User): Promise<SelfcheckResult> {
  if (!store.manualUpdate || !store.runtime) await loadRuntime();
  if (!store.runtime || typeof store.runtime.function !== 'function')
    throw new SelfcheckRuntimeError('cannot load runtime');
  try {
    const result = await (store.runtime
      .function as typeof import('./runtime').default)(user, context);
    if (result.inveYmd && result.registerDtm) return result;
    else throw new SelfcheckNetworkError('SELFCHECK_FAILED');
  } catch (err) {
    throw Object.assign(new SelfcheckNetworkError(), err);
  }
}

export { User, User as HCSUser } from './types';

export {
  selfcheck as healthCheck,
  selfcheck,
  selfcheck as default,
  selfcheck as hcs,
};

export {
  loadRuntime as manualUpdate,
  setRuntime as __UNSAFE_setRuntime,
  getRuntimeVersion,
  bundledRuntimeVersion,
} from './runtimeLoader';
export { disableAutoUpdate, default as __UNSAFE_store } from './configStore';
