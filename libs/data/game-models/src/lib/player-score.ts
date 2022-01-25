import { PlayerScoreHistory } from './player-score-history';
import { Player } from './player';

// UI only move this
export enum PlayerScoreMode {
    Editing,
    Current,
}

// @deprecated, use score round instead

export interface PlayerScore {
    playerScore: PlayerScoreHistory;
    playerIndex: number;
    player: Player;
    scoreIndex: number;
    score: number;
};
