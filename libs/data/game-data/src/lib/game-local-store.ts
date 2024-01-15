import { GameState } from '@ok-scoring/data/game-models';
import { GameDataStore } from './game-data';
import { openDatabase, Database } from 'expo-sqlite';


export class GameLocalStore implements GameDataStore {
  db: Database

  constructor(dbPath: string) {
    this.db = openDatabase(dbPath);
  }

  async init(): Promise<void> {
    // migrations
  }

  fetchGameState(key: string): Promise<GameState> {
    throw new Error('Method not implemented.');
  }
  fetchGameStates(): Promise<GameState[]> {
    throw new Error('Method not implemented.');
  }
  saveGameState(gameState: GameState): Promise<void> {
    throw new Error('Method not implemented.');
  }
  deleteGameState(key: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

}
