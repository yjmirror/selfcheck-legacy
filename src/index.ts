import { sleep } from './util';
import { User } from './types';
import { internalSetUA } from './headers';
import { findUser, passwordLogin, searchSchool, sendSurvey } from './api';
export type SelfcheckOptions = {
  delay?: number;
  userAgent?: string;
};

/**
 * Selfcheck - 교육부 자가진단 자동화
 * @param user 이용자 정보
 * @param options 옵션
 */
async function selfcheck(user: User, options: SelfcheckOptions = {}) {
  const { delay = 0, userAgent } = options;
  if (userAgent) internalSetUA(userAgent);
  const schoolInfo = await searchSchool(user);
  await sleep(delay);
  const token = await findUser(user, schoolInfo);
  await sleep(delay);
  const userInfo = await passwordLogin(token, user, schoolInfo);
  await sleep(delay);
  const surveyResult = await sendSurvey(token, userInfo, schoolInfo);
  if (!surveyResult.registerDtm) throw new Error('health check failed');
  return surveyResult;
}

export {
  SurveyResponse as SelfcheckResult,
  User,
  User as HCSUser,
} from './types';
export {
  selfcheck as healthCheck,
  selfcheck,
  selfcheck as default,
  selfcheck as hcs,
};
