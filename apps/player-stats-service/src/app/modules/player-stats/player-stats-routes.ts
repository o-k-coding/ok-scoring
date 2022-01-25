import { FastifyInstance } from 'fastify/types/instance';
import { RouteGenericInterface } from 'fastify/types/route';
import { PlayerGameEntity } from '../../../../../game-service/src/app/entities/player-game';
import { calculatePlayerStats } from './player-stats';


interface PlayerStatsGetRequest extends RouteGenericInterface {
    Querystring: { startDate: string, endDate: string, playerKey: string, gameKey?: string }
};

export default async function (fastify: FastifyInstance, opts: any) {
    fastify.get<PlayerStatsGetRequest>('/:playerKey', {}, async function (request, reply) {
        try {
            const { playerKey, gameKey } = request.query;
            const { playerRepo, playerGameRepo } = fastify.db;
            const player = await playerRepo.findOne(playerKey);
            if (!player) {
                reply.status(404).send({
                    error: `There was no player found for key ${playerKey}`
                });
            }
            let whereClause: Partial<PlayerGameEntity> = {
                playerKey
            };

            if (gameKey) {
                whereClause = {
                    ...whereClause,
                    gameKey,
                }
            }
            const playerGames = await playerGameRepo.find({
                where: whereClause,
                join: {
                    alias: 'playerGame',
                    innerJoinAndSelect: {
                        game: 'playerGame.game',
                    },
                }
            });
            const games = playerGames.map(pg => pg.game);

            const playerStats = calculatePlayerStats(games, playerKey);

            reply.status(200).send({
                playerStats,
            });
        } catch (e) {
            console.error('Error saving game state', e);
            reply.code(500).send({ error: 'There was an error saving your game state!' });
        }
    });
}
