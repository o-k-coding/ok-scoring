import { createServer } from './server';

export async function runApplication(worker?: number) {
  const server = createServer();

  // TODO configure port as env variable
  // Also todo could do something where we log the worker that has accepted a request?
  server.listen(3001, function (err, address) {
    if (err) {
      server.log.error(err);
      process.exit(1);
    }
    const startupMessage = `🚀 Server ready at ${address}` + (worker !== undefined ? ` on worker ${worker}` : '')
    server.log.info(startupMessage);
  });
}
