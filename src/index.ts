import { runtimeHost, updateRuntime } from './runtimeHost';

interface SelfcheckResult {
  registerDtm: string;
  inveYmd: string;
}

interface User {
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
   * 비밀번호
   */
  password: string;
}
/**
 * 교육부 자가진단 자동화
 * @param user 이용자 정보
 */
async function selfcheck(user: User): Promise<SelfcheckResult> {
  if (runtimeHost.useAutoUpdate) await updateRuntime();
  return await runtimeHost.runtime.default(user);
}

/**
 * 정상적인 사용자인지 확인
 * @param user 이용자 정보
 * @returns success 올바른 사용자인지 여부
 */
export async function validate(user: User): Promise<boolean> {
  if (runtimeHost.useAutoUpdate) await updateRuntime();
  return await runtimeHost.runtime.validate(user);
}

export {
  selfcheck,
  selfcheck as default,
  selfcheck as hcs,
  User,
  User as HCSUser,
};

export {
  instanciate as __instanciate,
  getRuntimeVersion as __getRuntimeVersion,
} from './runtimeHost';

export function useManualUpdate() {
  runtimeHost.useAutoUpdate = false;
  return updateRuntime;
}

export function __enableTestMode() {
  runtimeHost.useAutoUpdate = false;
  runtimeHost._internal['TEST'] = true;
}

export function __pretendInApp() {
  runtimeHost._internal['APP'] = true;
}

export { runtimeHost as __runtimeHost } from './runtimeHost';
