import { RedisClientType, createClient } from 'redis';
import { PlayerStats } from '../modules/player-stats/player-stats';
import { PlayerStatsStore } from './store';

export class RedisStore implements PlayerStatsStore {
  private client: RedisClientType;
  constructor() {
    // TODO config, also need to configure password
    this.client = createClient({
      url: 'redis://127.0.01:6379',
    });

    // TODO
    // client.on('error', (err) => console.log('Redis Client Error', err));
  }

  async get(key: string): Promise<PlayerStats> {
    const playerStatsString = await this.client.get(key);
    return JSON.parse(playerStatsString);
  }

  async set(key: string, stats: PlayerStats): Promise<void> {
    await this.client.set(key, JSON.stringify(stats));
  }

  async connect() {
    await this.client.connect();
  }
}
