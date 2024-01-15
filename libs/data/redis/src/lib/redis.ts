import { createClient } from '@redis/client';

export function createRedisClient(url) {
  return createClient({
    url
  })
    .on('error', (err) => console.error(err))
    .connect();
}
