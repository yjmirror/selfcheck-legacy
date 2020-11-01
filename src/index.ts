import { loadRuntime } from './runtimeLoader';
import { User } from './types';
import store from './configStore';
import { context } from './context';
import { API_TYPE } from './runtime/api';
export type SelfcheckResult = API_TYPE.SEND_SURVEY_RESULT;
export class SelfcheckError extends Error {}
/**
 * Selfcheck - 교육부 자가진단 자동화
 * @param user 이용자 정보
 * @param options 옵션
 */
async function selfcheck(user: User): Promise<SelfcheckResult> {
  if (!store.manualUpdate || !store.runtime) await loadRuntime();
  if (!store.runtime) throw new SelfcheckError('cannot load runtime');
  try {
    const result = await (store.runtime
      .function as typeof import('./runtime').default)(user, context);
    if (result.inveYmd && result.registerDtm) return result;
    else throw new SelfcheckError('SELFCHECK_FAILED');
  } catch (err) {
    throw Object.assign(new SelfcheckError('HCS_FAILED'), err);
  }
}

export { User, User as HCSUser } from './types';

export {
  selfcheck as healthCheck,
  selfcheck,
  selfcheck as default,
  selfcheck as hcs,
};
export { loadRuntime as manualUpdate } from './runtimeLoader';
export { disableAutoUpdate } from './configStore';
