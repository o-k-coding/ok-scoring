import { FastifyInstance } from 'fastify'
// import json schemas as normal
// import the generated interfaces
// import Ajv from 'ajv';
// import AjvErrors from 'ajv-errors';
import { FavoriteGame } from '@ok-scoring/data/game-models';
// const ajv = new Ajv({ allErrors: true });

// AjvErrors(ajv);

// function preValidatePost(request: FastifyRequest<GameStatePostRequest>, reply, done: HookHandlerDoneFunction) {
//     const validate = ajv.compile(GameStateBodySchema);
//     const isValid = validate(request.body);
//     console.log(validate.errors)
//     done(!isValid ? { code: 400, statusCode: 400, validation: validate.errors } as FastifyError : undefined)
// }

// const gameStatePostOpts: RouteShorthandOptions = {
//     schema: {
//         body: GameStateBodySchema,
//     },
//     // To add extra validation
//     preValidation: (preValidatePost)
// }

export default async function (fastify: FastifyInstance, opts: any) {
    fastify.post<{ Body: FavoriteGame }>('/favorite', {}, async function (request, reply) {
        try {
            // const { favoriteGamesRepo } = fastify.db;
            // const favoriteGame = request.body;
            // TODO check if exists already and return error if it does
            // await favoriteGamesRepo.insert(favoriteGame);
            reply.status(201).send({ message: 'Succesfully saved favorite game!' });
        } catch (e) {
            console.error('Error saving favorite game', e);
            reply.code(500).send({ error: 'There was an error saving your favorite game!' });
        }
    });
}
