// Require the framework and instantiate it
import fastify from 'fastify';
import playerStatsRoutes from './app/modules/player-stats/player-stats-routes';
// import dbConnector from './plugins/db-connector';

function createServer() {
    const server = fastify({
        logger: true
    })

    const apiBase = 'api/player-stats';

    // TODO wire DB
    // server.register(dbConnector);
    server.register(playerStatsRoutes, { prefix: `${apiBase}/player-stats` });

    // Run the server!
    return server;
}

const server = createServer();

// TODO configure port
server.listen(3001, function (err, address) {
    if (err) {
        server.log.error(err);
        process.exit(1);
    }
    server.log.info(`server listening on ${address}`);
})
