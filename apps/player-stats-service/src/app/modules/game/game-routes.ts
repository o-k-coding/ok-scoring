import { FastifyInstance, FastifyRequest, RouteShorthandOptions, HookHandlerDoneFunction, FastifyError, ValidationResult } from 'fastify'
 // import json schemas as normal
import GameStateBodySchema from '../../schemas/game-state-body.json';
// import the generated interfaces
import { GameStateBodySchema as GameStateBodySchemaInterface } from '../../../@types/game-state-body';
import * as Ajv from 'ajv';
import * as AjvErrors from 'ajv-errors';
const ajv = new Ajv({allErrors: true, jsonPointers: true});

AjvErrors(ajv);
type GameStatePostRequest = {
    Body: GameStateBodySchemaInterface
};

function preValidatePost(request: FastifyRequest<GameStatePostRequest>, reply, done: HookHandlerDoneFunction) {
    const validate = ajv.compile(GameStateBodySchema);
    const isValid = validate(request.body);
    console.log(validate.errors)
    done(!isValid ? { statusCode: 400, validation: validate.errors } as FastifyError : undefined)
}

const gameStatePostOpts: RouteShorthandOptions = {
    schema: {
        body: GameStateBodySchema,
    },
    // To add extra validation
    preValidation: preValidatePost
}

export default async function (fastify: FastifyInstance, opts: any) {
    fastify.post<GameStatePostRequest>('/', gameStatePostOpts, async function (request, reply) {
        try {
            const { gameRepo } = fastify.db;
            const gameState = request.body;
            await gameRepo.insert(gameState);
            reply.status(201).send({ message: 'Succesfully saved game state!' });
        } catch (e) {
            console.error('Error saving game state', e);
            reply.code(500).send({ error: 'There was an error saving your game state!' });
        }

    });
}
