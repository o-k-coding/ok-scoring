import { createContext } from 'react';
import { observable, action, makeObservable } from 'mobx';
import { initSQLLiteDb } from '@ok-scoring/data/sqlite-fns';
import { GameData } from '@ok-scoring/data/game-data';

class GameDataStore {
  @observable storeInitialized = false;
  @observable storeError = false;

  gameData: GameData;

  constructor() {
    makeObservable(this);
  }

  @action setDbInitialized = (initialized: boolean) => {
    this.storeInitialized = initialized;
  }

  initLocalDb = async () => {
    try {
      this.gameData = new GameData({
        localStorePath: 'game-data.db',
        cacheURL: 'redis://localhost:6379',
      });
      await this.gameData.init();
      this.setDbInitialized(true);
    } catch (e) {
      this.storeError = true;
      this.setDbInitialized(true);
      console.error(e);
    }
  }
}

export const localDbStore = new GameDataStore();
export const localDbContext = createContext(localDbStore);
