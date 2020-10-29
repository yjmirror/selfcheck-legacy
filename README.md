# Selfcheck - 교육부 자가진단 자동화 ![GitHub stars](https://img.shields.io/github/stars/yjmirror/selfcheck?style=social) [![npm version](https://badge.fury.io/js/selfcheck.svg)](https://badge.fury.io/js/selfcheck)

## 🌟 20201026 - 자가진단 업데이트 대응

---

### ⚡ 사용 전 유의 사항 !!

- 사용으로 인한 모든 책임은 본인에게 있음을 숙지하시길 바랍니다.

### [Examples](https://github.com/yjmirror/selfcheck/tree/master/examples)

### How To Use

```js
const { selfcheck } = require('selfcheck');
// or  import selfcheck from "selfcheck"
const user = {
  name: '이름', // 실명, string
  school: '학교', // '학교'로 끝나는 string
  area: '서울특별시', // 서울, 서울시, 서울특별시 등 아무렇게나 입력 가능, string
  birthday: '010101', // YYMMDD 형식의 string
  password: '1234', // 4자리 숫자, string
};

selfcheck(user)
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

type SelfcheckOptions = {
  delay?: number;
  userAgent?: string;
};

type SelfcheckResult = {
  registerDtm: string;
  inveYmd: string;
};

function selfcheck(
  user: User,
  options?: SelfcheckOptions
): Promise<SelfcheckResult>;
```

### 🔨 CHANGELOG

#### 2.0.1

- 보안 패치
- 매뉴얼 업데이트
- 예제 폴더 추가

#### 2.0.0

- 새로운 자가진단에 대응 (hcs.eduro.go.kr)

#### 3.0.0

- ES 모듈 지원

#### 4.0.0

- API 변경에 대응 (v2 namespace)

#### 4.0.1

- 라이브러리 이름 변경 (auto-health-selfcheck -> selfcheck)

#### 4.1.0

- bundle optimized
- 브라우저 지원

### TODO

- 자동 업데이트 기능 (제작중) - api 변경시에 npm 업데이트 필요 없음
