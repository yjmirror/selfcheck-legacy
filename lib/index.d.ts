export declare interface SelfcheckResult {
  registerDtm: string;
  inveYmd: string;
}

export declare type User = {
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
   * 비밀번호
   */
  password: string;
};
/**
 * 교육부 자가진단 자동화
 * @param user 이용자 정보
 */
declare function selfcheck(user: User): Promise<SelfcheckResult>;
/**
 * 정상적인 사용자인지 확인
 * @param user 이용자 정보
 * @returns success 올바른 사용자인지 여부
 */
export declare function validate(user: User): Promise<boolean>;

export declare class SelfcheckError extends Error {}
export { selfcheck, selfcheck as hcs, selfcheck as default };
