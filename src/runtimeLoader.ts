import axios from 'axios';
import { RUNTIME_PATH } from './constants';
import store, { Runtime } from './configStore';

declare var __BUNDLED_RUNTIME__: string;
const bundledRuntime: RuntimePayload = JSON.parse(__BUNDLED_RUNTIME__);
setRuntime(bundledRuntime);
export const bundledRuntimeVersion = bundledRuntime.version;
export interface RuntimePayload {
  code: string;
  version: number;
  options: any;
}
/**
 * 런타임을 업데이트
 */
export async function loadRuntime() {
  let { data: payload } = await axios.get<RuntimePayload>(RUNTIME_PATH);
  setRuntime(payload);
}

export function setRuntime({ code, version, options }: RuntimePayload) {
  if (options) Object.assign(store, options);
  store.runtime = {
    module: new Function(wrap(code))(),
    version,
  };
}

export function getRuntimeVersion() {
  return store.runtime.version;
}

/**
 * commonjs function wrapper
 * @param code commonjs code
 */
function wrap(code: string) {
  return `"use strict";const m={exports:{}};(function(module,exports){${code}}).call(m.exports,m,m.exports);return m.exports;`;
}
