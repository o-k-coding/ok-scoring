// src/plugins/db.ts
import 'reflect-metadata'
import fp from 'fastify-plugin'
import { createConnection, getConnectionOptions, Repository } from 'typeorm'
import { FastifyInstance } from 'fastify';
import { GameRulesEntity } from '../entities/game-rules';

export interface GameRulesDB {
    gameRulesRepo: Repository<GameRulesEntity>,
}

const dbConnector = fp(async (fastify: FastifyInstance, opts, done) => {
    try {
        // getConnectionOptions will read from ormconfig.js (or .env if that is prefered)
        const connectionOptions = await getConnectionOptions()
        Object.assign(connectionOptions, {
            options: { encrypt: true },
            synchronize: true,
            entities: [
                GameRulesEntity,
            ]
        })
        const connection = await createConnection(connectionOptions)
        console.log('Connection established');

        const db: GameRulesDB = {
            gameRulesRepo: connection.getRepository(GameRulesEntity),
        };

        // this object will be accessible from any fastify server instance
        fastify.decorate('db', db);

    } catch (error) {
        console.log('Error creating db', error)
    }
    done();
})

export default dbConnector;
