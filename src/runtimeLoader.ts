import axios from 'axios';
import { RUNTIME_PATH } from './constants';
import store, { Runtime } from './configStore';

declare global {
  const RUNTIME_VERSION: number;
}
export interface RuntimePayload {
  code: string;
  version: number;
  options: any;
}

export async function loadRuntime() {
  let { data: payload } = await axios.get<RuntimePayload>(RUNTIME_PATH);
  if (payload.version < RUNTIME_VERSION) {
    payload = (await axios.get<RuntimePayload>(RUNTIME_PATH)).data;
  }

  setRuntime(payload);
}
function setRuntime({ code, version, options }: RuntimePayload) {
  if (options) Object.assign(store, options);
  const runtime: Runtime = {
    function: interop(new Function(wrap(code))()),
    version,
  };
  store.runtime = runtime;
}
function wrap(code: string) {
  return `"use strict";const m={exports:{}};(function(module,exports){${code}}).call(m.exports,m,m.exports);return m.exports;`;
}
function interop(mod: any) {
  return '__esModule' in mod ? mod.default : mod;
}
