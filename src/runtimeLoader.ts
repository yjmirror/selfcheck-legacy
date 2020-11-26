import axios from 'axios';
import { RUNTIME_URL } from './constants';
import store from './configStore';
import { hostApi } from './hostApi';

declare var __BUNDLED_RUNTIME__: string;

const __bundledRuntime: RuntimePayload = JSON.parse(__BUNDLED_RUNTIME__);
__setRuntime(__bundledRuntime);

export interface RuntimePayload {
  code: string;
  version: number;
  options: any;
}

export async function loadRuntimeFromNetwork() {
  let { data: payload } = await axios.get<RuntimePayload>(RUNTIME_URL);
  __setRuntime(payload);
}

export function __setRuntime({ code, version, options }: RuntimePayload) {
  if (options) Object.assign(store, options);
  store.runtime = {
    module: instanciate(code),
    version,
  };
}

export function __getRuntimeVersion() {
  return { current: store.runtime.version, bundled: __bundledRuntime.version };
}

function instanciate(commonjs: string) {
  const code = `'use strict';const m={exports:{}};(function(module,exports,__HOST_API){${commonjs}}).call(m.exports,m,m.exports,__HOST_API);return m.exports;`;
  return new Function('__HOST_API', code)(hostApi);
}
