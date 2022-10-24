import fastify from 'fastify';
import { setupRoutes } from './routes';

export function createServer() {
  const server = fastify({
    logger: true
  })

  setupRoutes(server);

  // Run the server!
  return server;
}
