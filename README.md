# Auto-Health-SelfCheck (새로운 자가진단 자동화) ![GitHub stars](https://img.shields.io/github/stars/yjmirror/auto-health-selfcheck?style=social) [![npm version](https://badge.fury.io/js/auto-health-selfcheck.svg)](https://badge.fury.io/js/auto-health-selfcheck)

#### 코로나 예방을 위해서는 자가 진단이 아니라 마스크 착용과 사회적 거리두기 그리고 손 씻기 🚿가 필요합니다.

## 코로나 의심 증상이 있거나 확진자와 접축하였을 경우에는 반드시 등교하지 말고 <u>담임 선생님과 연락</u>하십시오.

## 마스크 착용 😷과 생활속 거리두기 📏로 코로나 사태를 극복합니다!!

---

### ⚡ 사용 전 유의 사항 !!

- 이 라이브러리는 **학습 목적**으로 만든 것이므로 다른 목적으로 사용해서는 안됩니다.
- 사용으로 인한 모든 책임은 당연히 본인에게 있음을 숙지하시길 바랍니다.
- 이 라이브러리는 정상 응답 (등교 가능) 만을 보낼 수 있으므로 이외의 상황에는 **절대로** 사용해서는 안됩니다.

### 🏭 복잡한 사용 예시는 [examples](https://github.com/yjmirror/auto-health-selfcheck/tree/master/examples)를 참조

### 🔥 쉬운 사용 방법 How To Use

1. Nodejs v14 및 Yarn 설치
2. `yarn init` 을 통해 프로젝트 생성
3. `yarn add auto-health-selfcheck` 으로 설치
4. 아래 코드를 적절히 수정하여 `app.js` 으로 저장
5. `node app.js` 실행

```js
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
```

### 📚 문서 Documents

```ts
type User = {
  name: string;
  school: string;
  area: string;
  birthday: string;
  password: string;
};

type HealthCheckResult = {
  registerDtm: string;
  inveYmd: string;
};

function healthCheck(user: User, delay = 0): Promise<HealthCheckResult>;
```

`setUserAgent("Mozilla/5.0 ...")`을 통해 직접 지정 가능
기본값은 `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36` 입니다

### 🔨 CHANGELOG

#### 2.1.0

- ES Module supports

#### 2.0.1

- 보안 패치
- 매뉴얼 업데이트
- 예제 폴더 추가

#### 2.0.0

- 새로운 자가진단에 대응
