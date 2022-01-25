import { Player } from './player';
import { GameScoreHistory } from './game-score-history';
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

    // Relationships
    // new
    rules?: GameRules;
    scoreHistory?: PlayerScoreHistory[];
}
