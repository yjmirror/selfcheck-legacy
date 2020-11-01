import { encrypt } from './encrypt';
import { apiGetRequest, apiPostRequest } from './request';
export declare const context: {
    get: typeof apiGetRequest;
    post: typeof apiPostRequest;
    encrypt: typeof encrypt;
};
export declare type ContextType = typeof context;
