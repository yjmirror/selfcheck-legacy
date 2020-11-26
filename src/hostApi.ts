import { encrypt } from './encrypt';
import { apiGetRequest, apiPostRequest } from './request';

export const hostApi = {
  get: apiGetRequest,
  post: apiPostRequest,
  encrypt: encrypt,
};

export type HOST_API_TYPE = typeof hostApi;
