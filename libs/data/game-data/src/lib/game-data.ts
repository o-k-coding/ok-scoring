// Should handle storing game data in the data stores
// should allow for multiple data stores including
// local storage, cache, persistent storage
// Essentially think of this as a repository layer
// in order should use local, cache and persistent store
// as long as one operation is successful we can move forward with the others happening in the background with retries
// also is enough failures happen we should do something... but we should try to allow the app to keep working

import { GameState } from '@ok-scoring/data/game-models';
import { GameCache } from './game-cache';

export interface GameDataStore {
  init(): Promise<void>;
  fetchGameState(key: string): Promise<GameState>;
  fetchGameStates(): Promise<GameState[]>;
  saveGameState(gameState: GameState): Promise<void>;
  deleteGameState(key: string): Promise<void>;
}

export class GameData {
  private localStore: GameDataStore;
  private cache: GameDataStore;
  private persistentStore: GameDataStore;


  constructor(config: { localStorePath?: string, cacheURL?: string, persistentStoreURL?: string }) {
    if (config?.localStorePath) {
      console.log('initializing local store');
    }
    this.localStore = null;
    if (config?.cacheURL) {
      console.log('initializing cache');
      this.cache = new GameCache(config.cacheURL);
    }
    if (config?.persistentStoreURL) {
      console.log('initializing persistent store');
    }
  }

  async init(): Promise<void> {
    if (this.localStore) {
      await this.localStore.init();
    }
    if (this.cache) {
      await this.cache.init();
    }
    if (this.persistentStore) {
      await this.persistentStore.init();
    }
  }

  fetchGameState(key: string) {
    return null;
  }

  fetchGameStates() {
    return null;
  }

  saveGameState() {
    return null;
  }

  deleteGameState() {
    return null;
  }
}
