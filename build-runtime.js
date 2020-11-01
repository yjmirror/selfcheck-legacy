const esbuild = require('esbuild');
const { writeJSONSync } = require('fs-extra');
const { outputFiles } = esbuild.buildSync({
  entryPoints: ['./src/runtime/index.ts'],
  minify: true,
  bundle: true,
  format: 'cjs',
  charset: 'utf8',
  platform: 'node',
  write: false,
});
const [{ contents }] = outputFiles;
const code = Buffer.from(contents.buffer).toString('utf8');
const { runtimeVersion } = require('./package.json');
const runtimePayload = { code, version: runtimeVersion, options: {} };
writeJSONSync('./lib/runtime.json', runtimePayload);
