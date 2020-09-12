import { decode } from 'jsonwebtoken';

import { loginWithSchool } from './loginWithSchool';
import { searchSchool, inferSchoolLevel } from './searchSchool';
import { secondLogin } from './secondLogin';

const { mockUser, mockSchoolInfo, mockToken } = require('../../mocks');

describe('search school', () => {
  it('infers school level', () => {
    expect(inferSchoolLevel(mockUser.school)).toEqual('고등학교');
  });
  it('throws error on unexpected school', () => {
    expect(() => inferSchoolLevel(mockUser.birthday)).toThrowError();
  });
  it('gets school information', async () => {
    const schoolInfo = await searchSchool(mockUser);
    expect(schoolInfo).toEqual(mockSchoolInfo);
  });
});

describe('login with school', () => {
  it('getes valid token', async () => {
    const token = await loginWithSchool(mockUser, mockSchoolInfo);
    expect(token.includes('Bearer')).toBeTruthy();
    const decoded = decode(token.replace('Bearer ', ''));
    expect(decoded).toHaveProperty('org', mockSchoolInfo.orgCode);
  });
});

describe('second login', () => {
  it('works well without error', async () => {
    await secondLogin(mockToken, mockUser, mockSchoolInfo);
  });
});
