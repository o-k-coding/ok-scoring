import { FastifyInstance } from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';
import playerStatsRoutes from './app/modules/player-stats/player-stats-routes';


export function setupRoutes(server: FastifyInstance<Server, IncomingMessage, ServerResponse>) {
  const apiBase = 'api/player-stats';

  // TODO wire DB
  // server.register(dbConnector);
  server.register(playerStatsRoutes, { prefix: `${apiBase}` });
}
