import fastify from 'fastify';
import { PlayerStatsQueue } from '../queue/queue';
import { PlayerStatsStore } from '../src/plugins/store-connector'
declare module 'fastify' {
  export interface FastifyInstance<
    HttpServer = Server,
    HttpRequest = IncomingMessage,
    HttpResponse = ServerResponse,
  > {
    store: PlayerStatsStore;
    queue: PlayerStatsQueue;
  }
}
