export interface RuntimePayload {
    code: string;
    version: number;
    options: any;
}
export declare function loadRuntime(): Promise<void>;
