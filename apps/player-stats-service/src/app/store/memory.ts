import { PlayerStats } from '../modules/player-stats/player-stats';
import { PlayerStatsStore } from './store';

export class MemoryStore implements PlayerStatsStore {
  private store: { [playerKey: string]: PlayerStats };
  constructor() {
    this.store = {};
  }

  async get(key: string): Promise<PlayerStats> {
    return this.store[key];
  }

  async set(key: string, stats: PlayerStats): Promise<void> {
    this.store[key] = stats;
  }

  async connect() {
    console.log('nothing to connect to for memory store');
  }
}
