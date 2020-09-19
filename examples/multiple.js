const { healthCheck } = require('auto-health-selfcheck');

const users = [
  {
    name: '사용자1',
    school: '가초등학교',
    area: '서울특별시', // 3월
    birthday: '010101',
    password: '1234',
  },
  {
    name: '사용자2',
    school: '나중학교',
    area: '부산광역시', // 6월
    birthday: '021225',
    password: '4321',
  },
  {
    name: '사용자3',
    school: '다고등학교',
    area: '인천광역시', // 9월
    birthday: '200815',
    password: '0101',
  },
];

(async () => {
  for (const user of users) {
    try {
      const result = await healthCheck(user);
      console.log(`user ${user.name} success`, result);
    } catch (error) {
      console.error('error happened', error);
    }
  }
})();
