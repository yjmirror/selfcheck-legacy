const esbuild = require('esbuild');
const fs = require('fs-extra');
const terser = require('terser');

process.on('unhandledRejection', process.exit);

const runtimeFileName = `runtime_v7.js`;

(async () => {
  const pkg = await fs.readJSON('./package.json');
  const s = await esbuild.startService();
  pkg.runtimeVersion++;
  console.log(`building version`, pkg.runtimeVersion);

  const { outputFiles } = await s.build({
    entryPoints: ['./src/runtime/index.ts'],
    bundle: true,
    define: {
      __RUNTIME_VERSION__: pkg.runtimeVersion,
    },
    format: 'cjs',
    charset: 'utf8',
    platform: 'node',
    write: false,
  });

  const [{ contents }] = outputFiles;
  const str = Buffer.from(contents.buffer).toString('utf8');
  const code = await terserMinifyRuntime(await terserMinifyRuntime(str));
  const runtimeCode = `/** @preserve Selfcheck Runtime v${pkg.runtimeVersion}
 * NEVER RUN IT DIRECTLY!!!
 */\n${code}`;

  function buildMain(format) {
    return s.build({
      entryPoints: ['./src/index.ts'],
      define: {
        __RUNTIME_VERSION__: pkg.runtimeVersion,
        __RUNTIME_DOWNLOAD_URL__: JSON.stringify(
          `https://raw.githubusercontent.com/yjmirror/selfcheck/master/lib/${runtimeFileName}`
        ),
        __BUNDLED_RUNTIME__: JSON.stringify(code),
      },
      format,
      external: ['axios', 'node-rsa'],
      platform: 'node',
      write: true,
      bundle: true,
      charset: 'utf8',
      outfile: `./lib/selfcheck.${format === 'cjs' ? 'js' : 'mjs'}`,
    });
  }

  await fs.writeJSON('./package.json', pkg, { spaces: 2 });
  await fs.writeFile(`./lib/${runtimeFileName}`, runtimeCode);

  await buildMain('cjs');
  await buildMain('esm');
  s.stop();
})();

async function terserMinifyRuntime(str) {
  const { code } = await terser.minify(str, {
    ecma: 12,
    compress: { hoist_funs: true, keep_classnames: false, passes: 10 },
    toplevel: true,
    format: {
      quote_style: /* AlwaysSingle */ 1,
    },
    mangle: {
      properties: {
        regex: /\$_\$$/,
      },
    },
  });
  return code;
}
