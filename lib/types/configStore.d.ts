interface ConfigStore {
    manualUpdate: boolean;
    runtime?: Runtime;
    publicKey: string;
    headers: Record<string, string>;
}
export interface Runtime {
    version: number;
    function: Function;
}
declare const config: ConfigStore;
export default config;
/**
 * 자동 업데이트를 비활성화
 */
export declare function disableAutoUpdate(): void;
