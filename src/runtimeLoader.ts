import axios from 'axios';
import { RUNTIME_PATH } from './constants';
import store, { Runtime } from './configStore';
import debug from './debug';

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
  debug.log('loading runtime');
  let { data: payload } = await axios.get<RuntimePayload>(RUNTIME_PATH);
  debug.log('loaded runtime');
  setRuntime(payload);
}

export function setRuntime({ code, version, options }: RuntimePayload) {
  if (options) Object.assign(store, options);
  const runtime: Runtime = {
    function: interop(new Function(wrap(code))()),
    version,
  };
  store.runtime = runtime;
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

/**
 * helper function
 */
function interop(mod: any) {
  return '__esModule' in mod ? mod.default : mod;
}
