# Selfcheck (Node) - 자가진단 자동화 ![GitHub stars](https://img.shields.io/github/stars/yj01jung/node-selfcheck?style=social) [![npm version](https://badge.fury.io/js/selfcheck.svg)](https://badge.fury.io/js/selfcheck)

<!--BEGIN_STATUS-->

## 2020년12월25일 테스트 결과: ✅ SUCCESS<br/>

<!--END_STATUS-->

### 유의사항!!

- 이 라이브러리는 [DENO VERSION](https://github.com/yj01jung/deno-selfcheck)을 nodejs에서 실행되도록 만든 호환 라이브러리입니다.
  가급적이면 편리한 [DENO VERSION](https://github.com/yj01jung/deno-selfcheck)을 이용하세요.
- Nodejs 12 미만은 지원하지 않습니다. (BigInt 지원 필요)
- 자동 업데이트는 지원하지 않습니다. (http dynamic import로 구현되어 node에서 구현 불가, 필요할 경우 deno로 작성하여 child_process로 실행하시오)
- 실행을 위해서 전역 객체에 fetch, atob, btoa등이 추가됩니다.

### How To Use

```js
const { selfcheck } = require('selfcheck');

(async () => {
  console.log(
    await selfcheck({
      name: '실명',
      birthday: '생일',
      school: '학교',
      area: '지역',
      password: '비밀번호',
    })
  );
})();
```

### Documents

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
   * 생일
   */
  birthday: string;
  /**
   * 자가진단 비밀번호
   */
  password: string;
}

type SelfcheckResult = {
  registerDtm: string;
  inveYmd: string;
};

/**
 * 자가진단을 수행
 * @param user 개인정보
 */
function selfcheck(user: User): Promise<SelfcheckResult>;

/**
 * 정상적으로 작동하는지 여부 확인
 * @param user 개인정보
 */
function validate(user: User): Promise<boolean>;
```
