import { GameRules, GameState, PlayerScoreHistory } from '@ok-scoring/features/game-models';
import { determineWinner2, isGameWon, scoreBeatsWinner, validateGameState } from './game-rules-fns';
import { cribbageValidStateSchema, cribbageWinStateSchema } from '@ok-scoring/data/game-test-data';
import { ErrorObject } from 'ajv';

describe('scoreBeatsWinner', () => {
    it('should return true if new score is higher than winningScore by default', () => {
        expect(scoreBeatsWinner(100, 105)).toEqual(true);
    });

    it('should return true if new score is higher than winningScore and high score wins', () => {
        expect(scoreBeatsWinner(100, 105, true)).toEqual(true);
    });

    it('should return false if new score is lower than winningScore by default', () => {
        expect(scoreBeatsWinner(100, 95)).toEqual(false);
    });

    it('should return false if new score is higher than winningScore and low score wins', () => {
        expect(scoreBeatsWinner(100, 105, false)).toEqual(false);
    });

    it('should return false if new score is lower than winningScore and high score wins', () => {
        expect(scoreBeatsWinner(100, 95, true)).toEqual(false);
    });
});

describe('determineWinner2', () => {
    it('should return nothing if no game', () => {
        expect(determineWinner2(null)).toBeNull();
    });

    it('should return nothing if no scoreHistory', () => {
        const game: GameState = { key: 'one', description: 'game', date: 0, };
        expect(determineWinner2(game)).toBeNull();
    });

    it('should return nothing if empty scoreHistory', () => {
        const game: GameState = { key: 'one', description: 'game', date: 0, scoreHistory: [] };
        expect(determineWinner2(game)).toBeNull();
    });

    it('should return nothing if all players have no scores', () => {
        const scoreHistory: PlayerScoreHistory[] = [
            { key: 'one', playerKey: 'one', gameKey: 'one', score: 0, scores: [], order: 0, },
            { key: 'two', playerKey: 'two', gameKey: 'one', score: 0, scores: [], order: 1, },
            { key: 'three', playerKey: 'three', gameKey: 'one', score: 0, scores: [], order: 2, },
        ];
        const game: GameState = { key: 'one', description: 'game', date: 0, scoreHistory };
        expect(determineWinner2(game)).toBeNull();
    });

    it('should return player with highest score by default', () => {
        const scoreHistory: PlayerScoreHistory[] = [
            { key: 'one', playerKey: 'one', gameKey: 'one', score: 11, scores: [{ key: 'one', playerScoreHistoryKey: 'one', score: 11, scores: [11], order: 0 }], order: 0, },
            { key: 'two', playerKey: 'two', gameKey: 'one', score: 50, scores: [{ key: 'two', playerScoreHistoryKey: 'two', score: 50, scores: [50], order: 0 }], order: 1, },
            { key: 'three', playerKey: 'three', gameKey: 'one', score: 14, scores: [{ key: 'three', playerScoreHistoryKey: 'three', score: 14, scores: [14], order: 0 }], order: 2, },
        ];
        const game: GameState = { key: 'one', description: 'game', date: 0, scoreHistory };
        expect(determineWinner2(game)).toEqual('two');
    });
});

describe('validateGameState', () => {
    it('should pass a valid game state', () => {
        const gameKey = '1';
        const rules: GameRules = {
            key: '1',
            gameKey,
            validStateSchema: cribbageValidStateSchema,
            winningSchema: cribbageWinStateSchema
        };

        const scoreHistory: PlayerScoreHistory[] = [
            { key: 'one', playerKey: 'one', gameKey: 'one', score: 11, scores: [{ key: 'one', playerScoreHistoryKey: 'one', score: 11, scores: [11], order: 0 }], order: 0, },
            { key: 'two', playerKey: 'two', gameKey: 'one', score: 50, scores: [{ key: 'two', playerScoreHistoryKey: 'two', score: 50, scores: [50], order: 0 }], order: 1, },
            { key: 'three', playerKey: 'three', gameKey: 'one', score: 14, scores: [{ key: 'three', playerScoreHistoryKey: 'three', score: 14, scores: [14], order: 0 }], order: 2, },
        ];

        const game: GameState = {
            key: gameKey,
            description: 'cribbage',
            date: Date.now(),
            rules,
            scoreHistory,
        };

        expect(validateGameState(game)).toEqual({ valid: true });
    });

    it('should return errors for an invalid game state', () => {
        const gameKey = '1';
        const rules: GameRules = {
            key: '1',
            gameKey,
            validStateSchema: cribbageValidStateSchema,
            winningSchema: cribbageWinStateSchema
        };

        const scoreHistory: PlayerScoreHistory[] = [
            { key: 'one', playerKey: 'one', gameKey: 'one', score: 11, scores: [{ key: 'one', playerScoreHistoryKey: 'one', score: 11, scores: [11], order: 0 }], order: 0, },
        ];

        const game: GameState = {
            key: gameKey,
            description: 'cribbage',
            date: Date.now(),
            rules,
            scoreHistory,
        };

        const expectedScoreHistoryError: ErrorObject = {
            instancePath: '/scoreHistory',
            keyword: 'minItems',
            message: 'must NOT have fewer than 2 items',
            params: {
                limit: 2,
            },
            schemaPath: '#/properties/scoreHistory/minItems',
        }

        expect(validateGameState(game)).toEqual({
            valid: false, errors: [
                expectedScoreHistoryError,
            ]
        });
    });
});

describe('isGameWon', () => {
    it('should pass a completed game state', () => {
        const gameKey = '1';
        const rules: GameRules = {
            key: '1',
            gameKey,
            validStateSchema: cribbageValidStateSchema,
            winningSchema: cribbageWinStateSchema
        };

        const scoreHistory: PlayerScoreHistory[] = [
            { key: 'one', playerKey: 'one', gameKey: 'one', score: 121, scores: [{ key: 'one', playerScoreHistoryKey: 'one', score: 121, scores: [121], order: 0 }], order: 0, },
            { key: 'two', playerKey: 'two', gameKey: 'one', score: 50, scores: [{ key: 'two', playerScoreHistoryKey: 'two', score: 50, scores: [50], order: 0 }], order: 1, },
            { key: 'three', playerKey: 'three', gameKey: 'one', score: 14, scores: [{ key: 'three', playerScoreHistoryKey: 'three', score: 14, scores: [14], order: 0 }], order: 2, },
        ];

        const game: GameState = {
            key: gameKey,
            description: 'cribbage',
            date: Date.now(),
            rules,
            scoreHistory,
        };

        expect(isGameWon(game)).toEqual(true);
    });

    it('should not pass an incomplete game state', () => {
        const gameKey = '1';
        const rules: GameRules = {
            key: '1',
            gameKey,
            validStateSchema: cribbageValidStateSchema,
            winningSchema: cribbageWinStateSchema
        };

        const scoreHistory: PlayerScoreHistory[] = [
            { key: 'one', playerKey: 'one', gameKey: 'one', score: 11, scores: [{ key: 'one', playerScoreHistoryKey: 'one', score: 11, scores: [11], order: 0 }], order: 0, },
            { key: 'two', playerKey: 'two', gameKey: 'one', score: 50, scores: [{ key: 'two', playerScoreHistoryKey: 'two', score: 50, scores: [50], order: 0 }], order: 1, },
            { key: 'three', playerKey: 'three', gameKey: 'one', score: 14, scores: [{ key: 'three', playerScoreHistoryKey: 'three', score: 14, scores: [14], order: 0 }], order: 2, },
        ];

        const game: GameState = {
            key: gameKey,
            description: 'cribbage',
            date: Date.now(),
            rules,
            scoreHistory,
        };

        expect(isGameWon(game)).toEqual(false);
    });
});
