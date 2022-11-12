import fastify from 'fastify';
import { PlayerStatsStore } from '../src/plugins/store-connector'
declare module 'fastify' {
  export interface FastifyInstance<
    HttpServer = Server,
    HttpRequest = IncomingMessage,
    HttpResponse = ServerResponse,
  > {
    store: PlayerStatsStore;
  }
}
