// src/plugins/db.ts
import 'reflect-metadata'
import fp from 'fastify-plugin'
import { FastifyInstance } from 'fastify';
import { buildQueue } from '../queue/queue';

const queueConnector = fp(async (fastify: FastifyInstance, opts, done) => {
  if (!process.env['OK_SCORING_PLAYER_STATS_QUEUE']) {
    console.log('no queue needed!');
    done();
    return;
  }
  try {
    // TODO does the store need a connect function?
    const queue = buildQueue();
    // TODO disconnect?
    await queue.connect();
    // this object will be accessible from any fastify server instance
    fastify.decorate('queue', queue);

  } catch (error) {
    console.log('Error creating queue', error)
  }
  done();
})

export default queueConnector;
