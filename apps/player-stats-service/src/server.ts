import fastify from 'fastify';
import { setupRoutes } from './routes';
import storeConnector from './app/plugins/store-connector';
import queueConnector from './app/plugins/queue-connector';

export function createServer() {
  const server = fastify({
    logger: true
  })

  server.register(storeConnector);
  server.register(queueConnector);
  setupRoutes(server);


  // Run the server!
  return server;
}
