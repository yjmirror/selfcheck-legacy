import { HEALTHY_RESULT } from '../constants';
import { SchoolInfo } from './searchSchool';
import { apiPostRequest } from '../request';

export async function sendSurvey(token: string, { baseURL }: SchoolInfo) {
  const response = await surveyApi({
    token,
    baseURL,
  });
  return response.data;
}

function surveyApi(payload: { token: string; baseURL: string }) {
  return apiPostRequest<SurveyPayload, SurveyResponse>(
    '/registerServey', // API 이름 유의 !! Servey임
    HEALTHY_RESULT,
    payload
  );
}

type SurveyPayload = typeof HEALTHY_RESULT;

export type SurveyResponse = {
  registerDtm: string;
  inveYmd: string;
};
