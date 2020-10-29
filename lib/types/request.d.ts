import { AxiosRequestConfig } from 'axios';
interface ApiOptions extends AxiosRequestConfig {
    token?: string;
}
export declare function apiGetRequest<R>(api: string, { token, baseURL, ...options }: ApiOptions): Promise<import("axios").AxiosResponse<R>>;
export declare function apiPostRequest<T, R>(api: string, data: T, { token, baseURL, ...options }: ApiOptions): Promise<import("axios").AxiosResponse<R>>;
export declare const defaultBaseURL = "hcs.eduro.go.kr";
export {};
