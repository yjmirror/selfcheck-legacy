export declare const defaultRuntimeVersion: number;
export interface RuntimePayload {
    code: string;
    version: number;
    options: any;
}
/**
 * 런타임을 업데이트
 */
export declare function loadRuntime(): Promise<void>;
export declare function setRuntime({ code, version, options }: RuntimePayload): void;
