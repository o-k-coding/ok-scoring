// src/plugins/db.ts
import 'reflect-metadata'
import fp from 'fastify-plugin'
import { createConnection, getConnectionOptions, Repository } from 'typeorm'
import { FastifyInstance } from 'fastify';
import { FavoriteGameEntity } from '@ok-scoring/data/game-entities';

export interface GameRulesDB {
    favoriteGamesRepo: Repository<FavoriteGameEntity>,
    // gameRulesRepo: Repository<GameRulesEntity>,
    // gameStateRepo: Repository<GameStateEntity>,
    // playerRepo: Repository<PlayerEntity>,
    // scoreRoundRepo: Repository<ScoreRoundEntity>,
    // playerScoreHistoryRepo: Repository<PlayerScoreHistoryEntity>,
}

const dbConnector = fp(async (fastify: FastifyInstance, opts, done) => {
    try {
        // getConnectionOptions will read from ormconfig.js (or .env if that is prefered)
        const connectionOptions = await getConnectionOptions()
        Object.assign(connectionOptions, {
            options: { encrypt: true },
            synchronize: true,
            entities: [
                FavoriteGameEntity,
                // PlayerEntity,
                // ScoreRoundEntity,
                // PlayerScoreHistoryEntity,
                // GameRulesEntity,
                // GameStateEntity,
            ]
        })
        const connection = await createConnection(connectionOptions)
        console.log('Connection established');

        const db: GameRulesDB = {
            favoriteGamesRepo: connection.getRepository(FavoriteGameEntity),
            // playerRepo: connection.getRepository(PlayerEntity),
            // scoreRoundRepo: connection.getRepository(ScoreRoundEntity),
            // playerScoreHistoryRepo: connection.getRepository(PlayerScoreHistoryEntity),
            // gameRulesRepo: connection.getRepository(GameRulesEntity),
            // gameStateRepo: connection.getRepository(GameStateEntity),
        };

        // this object will be accessible from any fastify server instance
        fastify.decorate('db', db);

    } catch (error) {
        console.log('Error creating db', error)
    }
    done();
})

export default dbConnector;
