const esbuild = require('esbuild');
const fs = require('fs-extra');
const terser = require('terser');

(async () => {
  const pkg = await fs.readJSON('./package.json');
  const s = await esbuild.startService();
  const { outputFiles } = await s.build({
    entryPoints: ['./src/runtime/index.ts'],
    bundle: true,
    format: 'cjs',
    charset: 'utf8',
    platform: 'node',
    write: false,
  });

  const [{ contents }] = outputFiles;
  const str = Buffer.from(contents.buffer).toString('utf8');
  const { code } = await terser.minify(str, {
    ecma: 10,
    compress: { hoist_funs: true, keep_classnames: false, passes: 5 },
    toplevel: true,
    mangle: {
      properties: {
        regex: /^\$\$.*\$\$$/,
      },
    },
  });
  pkg.runtimeVersion++;
  const runtimePayload = { version: pkg.runtimeVersion, options: {}, code };

  function builds(format, platform) {
    return s.build({
      entryPoints: ['./src/index.ts'],
      minify: true,
      bundle: true,
      define: {
        __RUNTIME_VERSION__: pkg.runtimeVersion,
        __BUNDLED_RUNTIME__: JSON.stringify(JSON.stringify(runtimePayload)),
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

  await fs.writeJSON('./package.json', pkg, { spaces: 2 });
  await fs.writeJSON('./lib/runtime.json', runtimePayload);
  await builds('cjs', 'node');
  await builds('cjs', 'browser');
  await builds('esm', 'node');
  await builds('esm', 'browser');
  s.stop();
})();
