// Specifical implementation of caching game data in Redis
// this should probably be made more generic, but this is a good start
import { GameState } from '@ok-scoring/data/game-models';
import { createClient } from '@redis/client';
import { GameDataStore } from './game-data';

export class GameCache implements GameDataStore {
  private redisClient; // For now directly use Redis, but this should be abstracted

  constructor(url: string) {
    this.redisClient = createClient({ url });
  }
  async init(): Promise<void> {
    await this.redisClient.connect();
  }
  async fetchGameState(key: string): Promise<GameState> {
    throw new Error('Method not implemented.');
  }
  async fetchGameStates(): Promise<GameState[]> {
    throw new Error('Method not implemented.');
  }
  async saveGameState(gameState: GameState): Promise<void> {
    await this.redisClient.hSet(gamesStateKey(gameState.key), gameState);
  }
  async deleteGameState(key: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

function gamesStateKey(id: string): string {
  return `games-state:${id}`;
}
