# Selfcheck - 교육부 자가진단 자동화 ![GitHub stars](https://img.shields.io/github/stars/yjmirror/selfcheck?style=social) [![npm version](https://badge.fury.io/js/selfcheck.svg)](https://badge.fury.io/js/selfcheck)

## 🌟 20201109 자가진단 3문항으로 수정

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
};

selfcheck(user)
  .then(result => console.log('자가진단 성공', result))
  .catch(err => console.error('오류 발생', err));
```

### 📚 문서 Documents

```ts
export interface User {
  /**
   * 실명
   */
  name: string;
  /**
   * 학교명
   */
  school: string;
  /**
   * 지역명
   */
  area: string;
  /**
   * 생일 (YYMMDD)
   */
  birthday: string;
  /**
   * 자가진단 비밀번호 (선택)
   */
  password?: string;
}

type SelfcheckResult = {
  registerDtm: string;
  inveYmd: string;
};
/**
 * 자가진단을 수행
 * @param user 자가진단을 수행할 사용자 정보
 */
function selfcheck(user: User): Promise<SelfcheckResult>;

/**
 * 사용자 정보를 검증
 * @param user 자가진단을 수행할 사용자 정보
 */
function validate(user: User): Promise<boolean>;
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

#### 4.2.0

- 비밀번호 인증 기본 비활성화

#### 5.0.0

- live patch 도입, npm 업데이트 필요 없이 자동으로 업데이트

#### 5.0.2

- doc 추가

#### 5.1.0

- 빌드 시스템 개편

#### 5.2.0

- debug 추가

#### 5.2.1

- debug 버그 수정

#### 5.3.0

- 버그 수정

#### 5.4.0

- 사용자 검증기능 추가 (validate)

#### 6.0.0

- Dropped support for 5.x
- New live patch method
- A lot of otimization
- Internal api renamed

#### 7.0.0

- 암호화 모듈 변경
- 속도 개선
