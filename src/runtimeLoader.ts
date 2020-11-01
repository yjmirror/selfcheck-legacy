import axios from 'axios';
import { RUNTIME_PATH } from './constants';
import store, { Runtime } from './configStore';

export interface RuntimePayload {
  code: string;
  version: number;
  options: any;
}

export async function loadRuntime() {
  // if (process.env.NODE_ENV === 'fuck') {
  //   const { code, version, options } = require('../lib/runtime.json');
  //   if (options) Object.assign(store, options);
  //   const runtime: Runtime = {
  //     function: interop(new Function(wrap(code))()),
  //     version,
  //   };
  //   store.runtime = runtime;
  // } else {
  const {
    data: { code, version, options },
  } = await axios.get<RuntimePayload>(RUNTIME_PATH);
  if (options) Object.assign(store, options);
  const runtime: Runtime = {
    function: interop(new Function(wrap(code))()),
    version,
  };
  store.runtime = runtime;
  // }
}

function wrap(code: string) {
  return `"use strict";const m={exports:{}};(function(module,exports){${code}}).call(m.exports,m,m.exports);return m.exports;`;
}
function interop(mod: any) {
  return '__esModule' in mod ? mod.default : mod;
}
