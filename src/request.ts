import axios, { AxiosRequestConfig } from 'axios';
import { apiHeaders } from './headers';

interface ApiOptions extends AxiosRequestConfig {
  token?: string;
}

export async function apiGetRequest<R>(
  api: string,
  { token, baseURL, ...options }: ApiOptions
) {
  const { data } = await axios.get<R>(api, {
    headers: apiHeaders(injectToken(token)),
    baseURL: baseURL && normalizeUrl(baseURL),
    ...options,
  });
  return data;
}

export async function apiPostRequest<T>(
  api: string,
  request: any,
  { token, baseURL, ...options }: ApiOptions
) {
  const { data } = await axios.post<T>(api, request, {
    headers: apiHeaders(injectToken(token)),
    baseURL: baseURL && normalizeUrl(baseURL),
    ...options,
  });
  return data;
}

function injectToken(token?: string) {
  return token ? { Authorization: token } : null;
}

function normalizeUrl(url: string) {
  return url.startsWith('https://') ? url : `https://${url}`;
}

export const defaultBaseURL = 'hcs.eduro.go.kr';
