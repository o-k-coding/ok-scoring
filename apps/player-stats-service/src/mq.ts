import { GameCalculationData } from './app/modules/player-stats/player-stats';
import { connect, ConsumeMessage } from 'amqplib';

export async function sendGameInQueue(game: GameCalculationData) {
  try {
    // TODO config
    const queueName = 'game_data_q';
    const mqConn = await connect('amqp://127.0.0.1');
    const chan = await mqConn.createChannel();
    // Create a transient queue
    chan.assertQueue(queueName, { durable: false });
    // Obviously not the most fun thing to do. Need to go back to the multithreaded js book for tips if I truely want to use this
    chan.sendToQueue(queueName, Buffer.from(JSON.stringify(game)));
    console.log('sent game to queue', queueName);
  } catch (e) {
    console.error('error connecting and sending game data to mq', e);
  }
}

export async function consumeFromGameQueue(cb: (game: GameCalculationData) => void) {
  try {
    // TODO config
    const queueName = 'game_data_q';
    const mqConn = await connect('amqp://127.0.0.1');
    const chan = await mqConn.createChannel();
    // Create a transient queue
    chan.assertQueue(queueName, { durable: false });
    // Obviously not the most fun thing to do. Need to go back to the multithreaded js book for tips if I truely want to use this
    // Could do some fun stuff with checking if the consumer already exists or something??
    // Also right now just embedding the json parsing directly since this code is knowledgeable of the data type.
    chan.consume(queueName, (msg: ConsumeMessage) => cb(JSON.parse(msg.content.toString())), { noAck: true });
    console.log('set up consumer for', queueName);
  } catch (e) {
    console.error('error connecting and consuming game data to mq', e);
  }
}
