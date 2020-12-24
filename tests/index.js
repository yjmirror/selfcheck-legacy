const { selfcheck } = require('..');
const path = require('path');
const fs = require('fs');
const util = require('util');
const format = require('date-fns/format');

const main = (module.exports = async () => {
  const user = require('./__testdata__');
  const now = new Date();
  let err = null;
  let result = null;
  try {
    result = await selfcheck(user);
  } catch (e) {
    err = e;
  }

  const cname = path.resolve(__dirname, 'latest-test.txt');
  const payload = `${util.inspect(err || result)}`;
  fs.writeFileSync(
    cname,
    `${err ? 'Error' : 'Success'} at ${now}\n\n${payload}`
  );

  const freadme = path.resolve('README.md');
  const orig = fs.readFileSync(freadme, 'utf8');
  const mdstring = `<!--BEGIN_STATUS-->

## ${format(now, 'yyyy년MM월dd일')} 테스트 결과: ${
    !err ? '✅ SUCCESS' : '❌ ERROR'
  }<br/>

${err ? `\n#### <br />${err}\n` : '\n'}
<!--END_STATUS-->`;
  fs.writeFileSync(
    freadme,
    orig.replace(/<!--BEGIN_STATUS-->[\s\S]*<!--END_STATUS-->/, mdstring)
  );
  return err || result;
});

if (require.main === module) {
  main().then(console.log);
}
