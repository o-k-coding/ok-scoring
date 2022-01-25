import { GameScoreHistory, GameState, } from '@ok-scoring/data/game-models';
import Ajv, { ErrorObject } from 'ajv';

const ajv = new Ajv();

export function scoreBeatsWinner(winningScore: number, score: number, highScoreWins: boolean = true): boolean {
    winningScore = isNaN(winningScore) ? 0 : winningScore;
    // TODO simplify with multiplication
    return (highScoreWins && score > winningScore) || (!highScoreWins && score < winningScore)
}

export function determineWinner2(game: GameState): string {
    const highScoreWins = game?.rules?.highScoreWins || true;
    return !!game?.scoreHistoryMap ? game.scoreHistoryMap.reduce((winner, playerScoreHistory) => {
        if (playerScoreHistory.scores.length && scoreBeatsWinner(winner.score, playerScoreHistory.score, highScoreWins)) {
            return { playerKey: playerScoreHistory.playerKey, score: playerScoreHistory.score }
        }
        return winner;
    }, { playerKey: null, score: null }).playerKey : null;
}

/**
 * @deprecated
 */
export function determineWinner(gameScoreHistory: GameScoreHistory, highScoreWins = true): string {
    const winningScore = { playerKey: '', score: highScoreWins ? -Infinity : Infinity };

    Object.keys(gameScoreHistory).forEach((playerKey: string) => {
        const { score, scores } = gameScoreHistory[playerKey];
        if (scores.length && scoreBeatsWinner(winningScore.score, score, highScoreWins)) {
            winningScore.playerKey = playerKey;
            winningScore.score = score;
        }
    });
    return winningScore.playerKey;
}

export function validateGameState(game: GameState): { valid: boolean, errors?: ErrorObject[] } {
    const schema = game.rules.validStateSchema;

    // TODO could cache this against the hash of the schema
    const validate = ajv.compile(schema);

    // TODO could also cache validation against the hash of the game state, so if cache hits for the schema, then can check cache for the result
    if (validate(game)) {
        return { valid: true };
    }

    return { valid: false, errors: validate.errors };
}


export function isGameWon(game: GameState): boolean {
    const schema = game.rules.winningSchema;

    // TODO could cache this against the hash of the schema
    const validate = ajv.compile(schema);

    // TODO could also cache validation against the hash of the game state, so if cache hits for the schema, then can check cache for the result
    return validate(game);
}
