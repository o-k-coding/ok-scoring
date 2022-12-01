import { GameRules } from './game-rules';
import { PlayerScoreHistory } from '..';

export interface GameState {
    key: string;
    description: string;
    date: number;

    duration?: number;
    winningPlayerKey?: string;
    activePlayerKey?: string;
    dealingPlayerKey?: string;

    rules?: GameRules;
    // An array of score histories, each player in the game will have exactly 1 entry in this array
    scoreHistory?: PlayerScoreHistory[];
}
