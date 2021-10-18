import { GameScoreHistory, GameState, Player, PlayerScoreHistory } from '@ok-scoring/features/game-models';
import Ajv from 'ajv';

const ajv = new Ajv();

export function scoreBeatsWinner(winningScore: number, score: number, highScoreWins: boolean = true): boolean {
    winningScore = isNaN(winningScore) ? 0 : winningScore;
    // TODO simplify with multiplication
    return (highScoreWins && score > winningScore) || (!highScoreWins && score < winningScore)
}

export function determineWinner2(game: GameState): string {
    const highScoreWins = game?.rules?.highScoreWins || true;
    return !!game?.scoreHistory ? game.scoreHistory.reduce((winner, playerScoreHistory) => {
        if (playerScoreHistory.scores.length && scoreBeatsWinner(winner.score, playerScoreHistory.score, highScoreWins)) {
            return { playerKey: playerScoreHistory.playerKey, score: playerScoreHistory.score }
        }
        return winner;
    }, { playerKey: null, score: null }).playerKey : null;
}

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

export function buildInitialHistory(players: Player[], startingScore: number): GameScoreHistory {
    return players.reduce(
        (history, player): GameScoreHistory => ({
            ...history,
            [player.key]: {
                playerKey: player.key,
                score: startingScore,
                scores: [],
            } as PlayerScoreHistory
        }),
        {}
    );
}

export function buildScoreHistoryRounds(scoreHistory: GameScoreHistory): number[] {
    const numberRounds = Math.max(...Object.values(scoreHistory).map(v => v.scores.length));
    return Array.from({ length: numberRounds }, (_, i) => i + 1);
}

export function reCalcCurrentScore(scoreHistory: PlayerScoreHistory): PlayerScoreHistory {
    scoreHistory.score = scoreHistory.scores.reduce((sum, s) => sum + s.score, 0);
    return scoreHistory;
}

export function validateGameState(game: GameState) {
    const schema = game.rules.validStateSchema;

    // TODO could cache this against the hash of the schema
    const validate = ajv.compile(schema);

    // TODO could also cache validation against the hash of the game state, so if cache hits for the schema, then can check cache for the result
    const result = validate(game);
}


export function isGameWon(game: GameState) {
    const schema = game.rules.winningSchema;

    // TODO could cache this against the hash of the schema
    const validate = ajv.compile(schema);

    // TODO could also cache validation against the hash of the game state, so if cache hits for the schema, then can check cache for the result
    const result = validate(game);
}
