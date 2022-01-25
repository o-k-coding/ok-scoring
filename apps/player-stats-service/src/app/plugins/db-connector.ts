// src/plugins/db.ts
import 'reflect-metadata'
import fp from 'fastify-plugin'
import { createConnection, getConnectionOptions, Repository } from 'typeorm'
import { GameStateEntity } from '../entities/game';
import { PlayerGameEntity } from '../../../../game-service/src/app/entities/player-game';
import { PlayerEntity } from '../entities/player';
import { SettingsEntity } from '../entities/settings';
import { FastifyInstance } from 'fastify';

export interface OkScoringDB {
    gameRepo: Repository<GameStateEntity>,
    playerRepo: Repository<PlayerEntity>,
    playerGameRepo: Repository<PlayerGameEntity>,
    settingsRepo: Repository<SettingsEntity>,
}

const dbConnector = fp(async (fastify: FastifyInstance, opts, done) => {
    console.log('Connecting to DB!');
    try {
        // getConnectionOptions will read from ormconfig.js (or .env if that is prefered)
        // TODO figure out how to specify the ormconfig for individual services in a safe way
        const connectionOptions = await getConnectionOptions()
        Object.assign(connectionOptions, {
            options: { encrypt: true },
            synchronize: true,
            entities: [
                GameStateEntity,
                PlayerEntity,
                PlayerGameEntity,
                SettingsEntity
            ]
        })
        const connection = await createConnection(connectionOptions)
        console.log('Connection established');

        const db: OkScoringDB = {
            gameRepo: connection.getRepository(GameStateEntity),
            playerRepo: connection.getRepository(PlayerEntity),
            playerGameRepo: connection.getRepository(PlayerGameEntity),
            settingsRepo: connection.getRepository(SettingsEntity),
        };

        // this object will be accessible from any fastify server instance
        fastify.decorate('db', db);
        // fastify.register(gameService);

    } catch (error) {
        console.log('Error creating db', error)
    }
    done();
})

export default dbConnector;
