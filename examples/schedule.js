const schedule = require('node-schedule');

const { healthCheck } = require('auto-health-selfcheck');

const user = {
  name: '이름', // 실명, string
  school: '학교', // '학교'로 끝나는 string
  area: '서울특별시', // 서울, 서울시, 서울특별시 등 아무렇게나 입력 가능, string
  birthday: '010101', // YYMMDD 형식의 string
  password: '1234', // 4자리 숫자, string
};

/** 
 * 자세한 내용은 cron 검색
    *   *   *   *   *   *
    ┬   ┬   ┬   ┬   ┬   ┬
    │   │   │   │   │   │
    │   │   │   │   │   └ day of week (0 - 7) (0 or 7 is Sun)
    │   │   │   │   └──── month (1 - 12)
    │   │   │   └──────── day of month (1 - 31)
    │   │   └──────────── hour (0 - 23)
    │   └──────────────── minute (0 - 59)
    └──────────────────── second (0 - 59, OPTIONAL)

 */
schedule.scheduleJob(
  '30 7 * * 1-5',
  /** @param {Date} d */ d => {
    console.log(`${d.getMonth()}월 ${d.getDate()}일 자가진단을 시작합니다`);
    healthCheck(user)
      .then(result => console.log('자가진단 성공', result))
      .catch(err => console.error('오류 발생', err));
  }
);

console.log(`매일 아침 7시 30분에 예정됨...`);
