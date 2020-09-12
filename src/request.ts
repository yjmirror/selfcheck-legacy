import axios, { AxiosRequestConfig } from 'axios';
import { apiHeaders } from './headers';

interface ApiOptions extends AxiosRequestConfig {
  token?: string;
}

export function apiGetRequest<R>(
  api: string,
  { token, baseURL, ...options }: ApiOptions
) {
  return axios.get<R>(api, {
    headers: apiHeaders(injectToken(token)),
    baseURL: baseURL && normalizeUrl(baseURL),
    ...options,
  });
}

export function apiPostRequest<T, R>(
  api: string,
  data: T,
  { token, baseURL, ...options }: ApiOptions
) {
  return axios.post<R>(api, data, {
    headers: apiHeaders(injectToken(token)),
    baseURL: baseURL && normalizeUrl(baseURL),
    ...options,
  });
}

function injectToken(token?: string) {
  return token ? { Authorization: token } : null;
}

function normalizeUrl(url: string) {
  return url.startsWith('https://') ? url : `https://${url}`;
}

export const defaultBaseURL = 'hcs.eduro.go.kr';
