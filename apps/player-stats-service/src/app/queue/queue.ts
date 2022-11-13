import { GameCalculationData } from '../modules/player-stats/player-stats';
import { RabbitMQQueue } from './mq';
import { RedisQueue } from './redis';

export interface PlayerStatsQueue {
  sendGame(game: GameCalculationData): Promise<void>,
  consumeGame(cb: (game: GameCalculationData) => void): Promise<void>,
  connect(): Promise<void>,
}

export function buildQueue(): PlayerStatsQueue {
  // Can be one of 'memory' | 'redis' currently
  const queueType = process.env['OK_SCORING_PLAYER_STATS_QUEUE'];

  // TODO this could be done better
  if (!['redis', 'rabbitmq'].includes(queueType)) {
    console.log('Using an unsupported value for queue!! setting to default "rabbitmq"', queueType);
    process.exit(1);
  }
  console.log('creating queue', queueType);
  switch (queueType) {
    case 'redis':
      return new RedisQueue();
    case 'rabbitmq':
      return new RabbitMQQueue();
  }
}
