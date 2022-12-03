import { PlayerStats } from '../modules/player-stats/player-stats';
import { MemoryStore } from './memory';
import { RedisStore } from './redis';


// TODO could take this and turn it into a cache object, then create a separate permanent store.
// Or idk., maybe use persistent redis
export interface PlayerStatsStore {
  get(key: string): Promise<PlayerStats>,
  set(key: string, stats: PlayerStats): Promise<void>,
  connect(): Promise<void>,
}

export function buildStore(): PlayerStatsStore {
  // Can be one of 'memory' | 'redis' currently
  const storeType = process.env['OK_SCORING_PLAYER_STATS_STORE'];

  // TODO this could be done better
  if (!['redis', 'memory'].includes(storeType)) {
    console.log('Using an unsupported value for store!! setting to default "memory"', storeType);
  }
  switch (storeType) {
    case 'redis':
      return new RedisStore();
    default:
      return new MemoryStore();
  }
}
