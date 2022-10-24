import { FastifyInstance } from 'fastify/types/instance';
import { RouteGenericInterface } from 'fastify/types/route';
import { calculatePlayerStats, GameCalculationData, PlayerStats } from './player-stats';

interface PlayerStatsGetRequest extends RouteGenericInterface {
    Params: { playerKey: string }
};

interface PlayerStatsPostRequest extends RouteGenericInterface {
    Body: GameCalculationData,
};

// Temporary in memory database for testing routes
const db: { [playerKey: string]: PlayerStats } = {

};

export default async function (fastify: FastifyInstance, opts: any) {
    fastify.get<PlayerStatsGetRequest>('/:playerKey', {}, async function (request, reply) {
        try {
            const { playerKey } = request.params;
            // const { playerRepo, playerGameRepo } = fastify.db;
            // const player = await playerRepo.findOne(playerKey);
            const playerStats = db[playerKey];
            if (!playerStats) {
                reply.status(404).send({
                    error: `There were no player stats found for key ${playerKey}`
                });
            }
            // TODO figure out what to do with this bit...
            // Looks like originally I was considering connecting this service to the DB with both players and stats, and calculating stats fresh every time a request is made (a la scoring engine)
            // This could work, but for now I want to try what it would be like calculating on push/pull and storing the state... we will see.
            // I can see the nice part of calculating on demand, because you can be a lot more flexible with calculations, treating games more like a timeline, and also applying filtering etc.

            // let whereClause: Partial<PlayerGameEntity> = {
            //     playerKey
            // };

            // if (gameKey) {
            //     whereClause = {
            //         ...whereClause,
            //         gameKey,
            //     }
            // }
            // const playerGames = await playerGameRepo.find({
            //     where: whereClause,
            //     join: {
            //         alias: 'playerGame',
            //         innerJoinAndSelect: {
            //             game: 'playerGame.game',
            //         },
            //     }
            // });
            // const games = playerGames.map(pg => pg.game);

            // const playerStats = calculatePlayerStats(games, playerKey);

            reply.status(200).send({
                playerStats,
            });
        } catch (e) {
            console.error('Error fetching player stats', e);
            reply.code(500).send({ error: 'There was an unexpected error fetching your player stats!' });
        }
    });

    fastify.post<PlayerStatsPostRequest>('', {}, async function (request, reply) {
        try {
            const gameData = request.body;
            // TODO no validation that game data actually exists lol
            fastify.log.info('gameData ' + gameData.winningPlayerKey);

            // For each player in the game data, calculate stats

            // TODO this seems terribly inefficient
            for (const playerScore of gameData.scoreHistory) {
                const playerStats = db[playerScore.playerKey];
                let games = [gameData];
                if (playerStats?.games) {
                    games = [...playerStats.games, gameData]
                }
                const newPlayerStats = calculatePlayerStats(games, playerScore.playerKey);
                db[playerScore.playerKey] = newPlayerStats;
            }

            reply.status(201).send();
        } catch (e) {
            console.error('Error saving player stats', e);
            reply.code(500).send({ error: 'There was an unexpected error saving your player stats!' });
        }
    });
}
