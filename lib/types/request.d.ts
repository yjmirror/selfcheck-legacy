import { AxiosRequestConfig } from 'axios';
interface ApiOptions extends AxiosRequestConfig {
    token?: string;
}
export declare function apiGetRequest<R>(api: string, { token, baseURL, ...options }: ApiOptions): Promise<R>;
export declare function apiPostRequest<T>(api: string, request: any, { token, baseURL, ...options }: ApiOptions): Promise<T>;
export {};
