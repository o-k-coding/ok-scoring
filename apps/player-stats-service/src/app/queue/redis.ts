import { RedisClientType, createClient } from 'redis';
import { GameCalculationData } from '../modules/player-stats/player-stats';
import { PlayerStatsQueue } from './queue';

export class RedisQueue implements PlayerStatsQueue {
  private client: RedisClientType;
  private channel = 'game_data_q'; // TODO naming
  constructor() {
    // TODO config, also need to configure password
    // TODO also potentially have two redis clients? maybe not a problem since separation of concerns
    // But maybe could create like a part class for these infra pieces that could allow reuse across use cases.

    // NOTE if you use the same service for pub sub, you need two clients. this is not a problem here since each process will get 1 instance of this class
    this.client = createClient({
      url: 'redis://127.0.01:6379',
    });
    // TODO
    // client.on('error', (err) => console.log('Redis Client Error', err));
  }

  async sendGame(game: GameCalculationData): Promise<void> {
    await this.client.publish(this.channel, JSON.stringify(game));
  }

  async consumeGame(cb: (game: GameCalculationData) => void): Promise<void> {
    await this.client.subscribe(this.channel, (message) => {
      console.log('GAME CONSUMED!');
      cb(JSON.parse(message));
    });
  }

  async connect(): Promise<void> {
    await this.client.connect();
  }

}
