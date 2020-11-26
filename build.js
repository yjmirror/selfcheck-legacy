const esbuild = require('esbuild');
const fs = require('fs-extra');
const terser = require('terser');

process.on('unhandledRejection', process.exit);
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
        regex: /\$_\$$/,
      },
    },
  });
  pkg.runtimeVersion++;
  console.log(`building version`, pkg.runtimeVersion);
  const runtimePayload = {
    version: pkg.runtimeVersion,
    options: pkg.runtimePayload || {},
    code,
  };

  function builds(format) {
    return s.build({
      entryPoints: ['./src/index.ts'],
      define: {
        __RUNTIME_VERSION__: pkg.runtimeVersion,
        __BUNDLED_RUNTIME__: JSON.stringify(JSON.stringify(runtimePayload)),
      },
      format,
      external: ['axios', 'node-rsa'],
      platform: 'node',
      write: true,
      bundle: true,
      charset: 'utf8',
      outfile: `./lib/selfcheck.${format === 'cjs' ? 'cjs' : 'mjs'}`,
    });
  }

  await fs.writeJSON('./package.json', pkg, { spaces: 2 });
  await fs.writeJSON('./lib/runtime_next.json', runtimePayload);

  await builds('cjs');
  await builds('esm');
  s.stop();
})();
