const selfcheck = require('.');
const path = require('path');
const fs = require('fs');
const util = require('util');
const format = require('date-fns/format');

module.exports = async () => {
  selfcheck.__enableTestMode();
  const user = require('./__testdata__');

  const now = new Date();
  let err = null;
  let result = null;
  try {
    result = await selfcheck.default(user);
  } catch (e) {
    err = e;
  }

  const cname = path.resolve(__dirname, 'latest-test.txt');
  const payload = `Runtime Version: v${selfcheck.__getRuntimeVersion().current}
${util.inspect(err || result)}`;
  fs.writeFileSync(
    cname,
    `${err ? 'Error' : 'Success'} at ${now}\n\n${payload}`
  );

  const freadme = path.join(__dirname, 'README.md');
  const orig = fs.readFileSync(freadme, 'utf8');
  const mdstring = `<!--BEGIN_STATUS-->

## ${format(now, 'yyyy년MM월dd일')} 테스트 결과: ${
    !err ? '✅ SUCCESS' : '❌ ERROR'
  }<br/>

#### 런타임 버전: v${selfcheck.__getRuntimeVersion().current}
${err ? `\n#### <br />${err}\n` : '\n'}
<!--END_STATUS-->`;
  fs.writeFileSync(
    freadme,
    orig.replace(/<!--BEGIN_STATUS-->[\s\S]*<!--END_STATUS-->/, mdstring)
  );
};
