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
export declare function disableAutoUpdate(): void;
