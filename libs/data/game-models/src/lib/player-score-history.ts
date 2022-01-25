import { Score } from './score';
import { ScoreRound } from './score-round';

export interface PlayerScoreHistory extends Score<ScoreRound> {
    key?: string;
    playerKey: string;
    gameKey: string;
}
