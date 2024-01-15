import { dataRedis } from './redis';

describe('dataRedis', () => {
  it('should work', () => {
    expect(dataRedis()).toEqual('data-redis');
  });
});
