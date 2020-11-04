const esbuild = require('esbuild');
const { writeJSONSync, readJSONSync } = require('fs-extra');

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
const pkg = readJSONSync('./package.json');

pkg.runtimeVersion++;
writeJSONSync('./package.json', pkg, { spaces: 2 });
const runtimePayload = { code, version: pkg.runtimeVersion, options: {} };
writeJSONSync('./lib/runtime.json', runtimePayload);

function builds(format, platform) {
  esbuild.buildSync({
    entryPoints: ['./src/index.ts'],
    minify: true,
    bundle: true,
    define: {
      RUNTIME_VERSION: pkg.runtimeVersion,
    },
    format,
    platform,
    write: true,
    charset: 'utf8',
    outfile: `./lib/selfcheck${platform === 'browser' ? '.browser' : ''}.${
      format === 'cjs' ? 'cjs' : 'mjs'
    }`,
  });
}
// cjs builds
builds('cjs', 'node');
builds('cjs', 'browser');

// esm builds
builds('esm', 'node');
builds('esm', 'browser');
