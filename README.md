# Auto-Health-SelfCheck (자가진단 v2 자동화)

#### 코로나 예방을 위해서는 자가 진단이 아니라 마스크 착용과 사회적 거리두기 그리고 손 씻기가 필요합니다.

#### 자가 진단은 형식적이고 쓸데없는 설문 체크를 통해 학생들과 선생님의 고통을 유발하고 실질적인 예방 효과는 없습니다.

#### 그러므로 자가진단은 폐지되거나 차라리 매일 등교전 마스크, 손씻기 인증샷 처럼 실질적인 대책으로 변경되어야 합니다.

## 코로나 의심 증상이 있거나 확진자와 접축하였을 경우에는 반드시 등교하지 말고 <u>담임 선생님과 연락</u>하십시오.

## 마스크 착용과 생활속 거리두기로 코로나 사태를 극복합니다!!

### ⚡ 사용 전 유의 사항 !!

- 이것은 프로그램이 아니라 라이브러리입니다. (사용은 본인의 몫입니다)
- 이 라이브러리를 사용함으로서 모든 **책임**은 이용자 **본인**에게 있습니다.
- 이 라이브러리는 정상 응답 (등교 가능) 만을 보낼 수 있으므로 이외의 상황에는 **절대로** 사용해서는 안됩니다.

### 🎀 기능 & 특징 Features

- Open Source 이므로 개인정보 유출 위험성 없음

- 빠른 속도 (API에 직접 요청)

- 브라우저의 Header를 사용하여 비교적 안전

- 실제 클라이언트의 api request를 100% 구현

- 자동 학교급 추론 기능

- TypeScript로 작성되었고 단위 테스트로 안정성 확보

- User Agent 수정 가능 (다만 기본으로 가장 흔한 브라우저의 UA를 사용하므로 변경을 권장하지 않음 )

### 🔥 쉬운 사용 방법 How To Use

1. Nodejs v14 및 Yarn 설치
2. `yarn init` 을 통해 프로젝트 생성
3. `yarn add auto-health-selfcheck` 으로 설치
4. 아래 코드를 적절히 수정하여 `app.js` 으로 저장
5. `node app.js` 실행
6. 기호에 따라 `node-schedule` 등을 사용하여 자동화

```ts
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

### 🔨 TODO

- 학교 이름으로 지역 자동 검색
- 에러 처리 개선
- 헤더 업데이트
