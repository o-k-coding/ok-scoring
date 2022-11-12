import fastify from 'fastify';
import { setupRoutes } from './routes';
import storeConnector from './app/plugins/store-connector';

export function createServer() {
  const server = fastify({
    logger: true
  })

  server.register(storeConnector);
  setupRoutes(server);


  // Run the server!
  return server;
}
