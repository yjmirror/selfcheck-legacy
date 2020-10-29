export declare function internalSetUA(userAgent: string): void;
export declare function config(headers: Record<string, string>): void;
declare type HeaderTemplate = (headers?: Record<string, string> | null) => Record<string, string>;
export declare const apiHeaders: HeaderTemplate;
export {};
