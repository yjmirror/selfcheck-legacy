import axios from 'axios';
import crypto from 'crypto';

export type Runtime = typeof import('./runtime');

export class SelfcheckError extends Error {}
SelfcheckError.prototype.name = 'SelfcheckError';

export const runtimeHost: RuntimeHost = {
  url: __RUNTIME_DOWNLOAD_URL__,
  useAutoUpdate: true,
  runtime: null!,
  _internal: {},
};

const hostApi = {
  crypto,
  axios,
  Buffer,
  SelfcheckError,
  __: runtimeHost,
};

export const bundledRuntime = instanciate(__BUNDLED_RUNTIME__);
runtimeHost.runtime = bundledRuntime;

export async function updateRuntime() {
  const { data } = await axios.get<string>(runtimeHost.url);
  runtimeHost.runtime = instanciate(data);
}

export function getRuntimeVersion() {
  return {
    bundled: bundledRuntime.version,
    current: runtimeHost.runtime.version,
  };
}

export function instanciate(commonjs: string): Runtime {
  const code = `'use strict';const m={exports:{}};(function(module,exports,__HOST_API){${commonjs}}).call(m.exports,m,m.exports,__HOST_API);return m.exports;`;
  return new Function('__HOST_API', code)(hostApi);
}

declare const __BUNDLED_RUNTIME__: string;
declare const __RUNTIME_DOWNLOAD_URL__: string;
export type HOST_API_TYPE = typeof hostApi;
export interface RuntimeHost {
  useAutoUpdate: boolean;
  runtime: Runtime;
  url: string;

  _internal: Record<string, any>;
}
