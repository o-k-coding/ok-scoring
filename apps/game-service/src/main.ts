// Require the framework and instantiate it
import fastify from 'fastify';
import dbConnector from './app/plugins/db-connector';
import gameRulesRoutes from './app/modules/game/game-routes';

function createServer() {
    const server = fastify({
        logger: true
    })

    const apiBase = 'api/game';

    server.register(dbConnector);
    server.register(gameRulesRoutes, { prefix: `${apiBase}` });

    // Run the server!
    return server;
}

const server = createServer();

server.listen(3002, function (err, address) {
    if (err) {
        server.log.error(err);
        process.exit(1);
    }
    server.log.info(`server listening on ${address}`)
})
