import { Delay } from './util';
import { User } from './types';

import { secondLogin, loginWithSchool, searchSchool, sendSurvey } from './api';

/**
 * Auto Health Self Check Library
 * @author Yujun Jung <yj01jung@gmail.com>
 * @license MIT License
 * @param user user data
 * @param delay delay between http requests
 */
async function healthCheck(user: User, delay: number = 0) {
  const s = new Delay(delay);
  const schoolInfo = await searchSchool(user);
  await s.sleep();
  const token = await loginWithSchool(user, schoolInfo);
  await s.sleep();
  if (user.password) {
    await secondLogin(token, user, schoolInfo);
    await s.sleep();
  }
  const surveyResult = await sendSurvey(token, schoolInfo);
  if (!surveyResult.registerDtm) throw new Error('health check failed');
  return surveyResult;
}

export * from './types';
export { setUserAgent, setDefaultConfig } from './headers';
export { healthCheck, healthCheck as default };
