import { loadRuntimeFromNetwork } from './runtimeLoader';
import { User } from './types';
import store, { configureAutoUpdate } from './configStore';
import { API_TYPE } from './runtime/api';

export type SelfcheckResult = API_TYPE.SEND_SURVEY_RESULT;
export class SelfcheckError extends Error {}

/**
 * 교육부 자가진단 자동화
 * @param user 이용자 정보
 */
async function selfcheck(user: User): Promise<SelfcheckResult> {
  if (store.useAutoUpdate) await loadRuntimeFromNetwork();
  try {
    const result = await store.runtime.module.default(user);
    if (result.inveYmd && result.registerDtm) return result;
    else throw new SelfcheckError('SELFCHECK_FAILED');
  } catch (err) {
    throw Object.assign(new SelfcheckError(), err);
  }
}

/**
 * 정상적인 사용자인지 확인
 * @param user 이용자 정보
 */
export async function validate(user: User): Promise<boolean> {
  if (store.useAutoUpdate) await loadRuntimeFromNetwork();
  const result = await store.runtime.module.validate(user);
  return result;
}

export { User, User as HCSUser } from './types';

export {
  selfcheck as healthCheck,
  selfcheck,
  selfcheck as default,
  selfcheck as hcs,
};

export {
  __setRuntime as __v3Ry_uNsTab1E_setRuntime,
  __getRuntimeVersion as __getRuntimeVersion,
} from './runtimeLoader';

export async function useManualUpdate() {
  await loadRuntimeFromNetwork();
  configureAutoUpdate(false);
  return loadRuntimeFromNetwork;
}

export function __enableTestMode() {
  configureAutoUpdate(false);
}

export {
  default as __store,
  configureAutoUpdate as __configureAutoUpdate,
} from './configStore';
