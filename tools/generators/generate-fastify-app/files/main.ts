// Require the framework and instantiate it
import fastify from 'fastify';
import dbConnector from './app/plugins/db-connector';
import <%= camelize(name)%>Routes from './app/modules/<%= dasherize(name)%>/<%= dasherize(name)%>-routes';

function createServer() {
    const server = fastify({
        logger: true
    })

    const apiBase = 'api/<%= dasherize(name)%>';

    server.register(dbConnector);
    server.register(<%= camelize(name)%>Routes, { prefix: `${apiBase}` });

    // Run the server!
    return server;
}

const server = createServer();

server.listen(3003, function (err, address) {
    if (err) {
        server.log.error(err);
        process.exit(1);
    }
    server.log.info(`server listening on ${address}`)
})
