const { healthCheck } = require('auto-health-selfcheck');

const user = {
  name: '이름', // 실명, string
  school: '학교', // '학교'로 끝나는 string
  area: '서울특별시', // 서울, 서울시, 서울특별시 등 아무렇게나 입력 가능, string
  birthday: '010101', // YYMMDD 형식의 string
  password: '1234', // 4자리 숫자, string
};

healthCheck(user)
  .then(result => console.log('자가진단 성공', result))
  .catch(err => console.error('오류 발생', err));
