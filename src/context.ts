import { encrypt } from './encrypt';
import { apiGetRequest, apiPostRequest } from './request';

export const context = {
  get: apiGetRequest,
  post: apiPostRequest,
  encrypt: encrypt,
};
export type ContextType = typeof context;
