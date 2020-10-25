import { sleep } from './util';
import { User } from './types';

import { findUser, passwordLogin, searchSchool, sendSurvey } from './api';

/**
 * Auto Health Self Check Library
 * @param user user data
 * @param delay delay between http requests
 */
async function healthCheck(user: User, delay: number = 0) {
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

export * from './types';
export { setUserAgent, setDefaultConfig } from './headers';
export { healthCheck, healthCheck as default };
