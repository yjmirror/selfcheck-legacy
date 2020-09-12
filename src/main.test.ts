import healthCheck from '.';
const { mockUser } = require('../mocks');

describe('main', () => {
  it('works without error', async () => {
    const result = await healthCheck(mockUser);
    console.log(result);
    expect(result).toHaveProperty('registerDtm');
  });
});
