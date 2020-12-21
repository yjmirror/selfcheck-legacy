const run = require('./__test__');
const sched = require('node-schedule');
const { execSync } = require('child_process');
const sleep = t => new Promise(r => setTimeout(r, t));
const randInt = (a, b) => a + Math.floor(Math.random() * (++b - a));
sched.scheduleJob('7 0 * * *', async () => {
  await sleep(randInt(0, 30) * 60000);
  await run();
  execSync(`git commit -m "test at ${+new Date()}" -a`);
  execSync(`git push`);
});
