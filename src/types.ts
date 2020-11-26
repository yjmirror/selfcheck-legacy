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

export type SurveyResponse = {
  registerDtm: string;
  inveYmd: string;
};
