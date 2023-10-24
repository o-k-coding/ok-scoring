import { dataRedis } from './data-redis';

describe('dataRedis', () => {
  it('should work', () => {
    expect(dataRedis()).toEqual('data-redis');
  });
});
