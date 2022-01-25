import { Score } from './score';

export interface ScoreRound extends Score {
    key?: string;
    playerScoreHistoryKey: string;
}
