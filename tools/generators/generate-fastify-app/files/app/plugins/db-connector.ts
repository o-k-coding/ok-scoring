// src/plugins/db.ts
import 'reflect-metadata'
import fp from 'fastify-plugin'
import { createConnection, getConnectionOptions, Repository } from 'typeorm'
import { FastifyInstance } from 'fastify';
import { <%= classify(name)%>Entity } from '../entities/<%= dasherize(name)%>';

export interface <%= classify(name)%>DB {
    <%= camelize(name)%>Repo: Repository<<%= classify(name)%>Entity>,
}

const dbConnector = fp(async (fastify: FastifyInstance, opts, done) => {
    try {
        // getConnectionOptions will read from ormconfig.js (or .env if that is prefered)
        const connectionOptions = await getConnectionOptions()
        Object.assign(connectionOptions, {
            options: { encrypt: true },
            synchronize: true,
            entities: [
                <%= classify(name)%>Entity,
            ]
        })
        const connection = await createConnection(connectionOptions)
        console.log('Connection established');

        const db: <%= classify(name)%>DB = {
            <%= camelize(name)%>Repo: connection.getRepository(<%= classify(name)%>Entity),
        };

        // this object will be accessible from any fastify server instance
        fastify.decorate('db', db);

    } catch (error) {
        console.log('Error creating db', error)
    }
    done();
})

export default dbConnector;
