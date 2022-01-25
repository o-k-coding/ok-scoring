// import { GameState } from '@ok-scoring/data/game-models';
// import { FastifyInstance } from 'fastify';
// import fp from 'fastify-plugin';

// export interface GameService {
//     insertGameState: (gameState: GameState) => Promise<boolean>
// }

// const gameService = fp((fastify: FastifyInstance) => {
//     const {
//         gameRepo,
//     } = fastify.db;
//     const gameService = {
//         insertGameState: async (gameState: GameState) => {
//             const result = await gameRepo.insert(gameState);
//             return !!result;
//         }
//     };
//     fastify.decorate('gameService', gameService);
// });

export default {};
