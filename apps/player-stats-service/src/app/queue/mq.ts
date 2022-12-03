import { GameCalculationData } from '../modules/player-stats/player-stats';
import { Channel, connect, ConsumeMessage } from 'amqplib';
import { PlayerStatsQueue } from './queue';

export class RabbitMQQueue implements PlayerStatsQueue {

  private queueName = 'game_data_q';
  private channel: Channel;

  async sendGame(game: GameCalculationData): Promise<void> {
    try {
      if (!this.channel) {
        await this.connect();
      }
      // Obviously not the most fun thing to do. Need to go back to the multithreaded js book for tips if I truely want to use this
      this.channel.sendToQueue(this.queueName, Buffer.from(JSON.stringify(game)));
      console.log('sent game to queue', this.queueName);
    } catch (e) {
      console.error('error connecting and sending game data to mq', e);
    }
  }
  async consumeGame(cb: (game: GameCalculationData) => void): Promise<void> {
    try {
      if (!this.channel) {
        await this.connect();
      }
      // Obviously not the most fun thing to do. Need to go back to the multithreaded js book for tips if I truely want to use this
      // Could do some fun stuff with checking if the consumer already exists or something??
      // Also right now just embedding the json parsing directly since this code is knowledgeable of the data type.
      this.channel.consume(this.queueName, (msg: ConsumeMessage) => cb(JSON.parse(msg.content.toString())), { noAck: true });
      console.log('set up consumer for', this.queueName);
    } catch (e) {
      console.error('error connecting and consuming game data to mq', e);
    }
  }

  async connect(): Promise<void> {
    // TODO config, also should the connection be long lived??
    const mqConn = await connect('amqp://127.0.0.1');
    const chan = await mqConn.createChannel();
    // Create a transient queue
    chan.assertQueue(this.queueName, { durable: false });
    this.channel = chan;
  }

}
