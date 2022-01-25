import { PlayerScoreHistory } from './player-score-history';

export interface GameScoreHistory {
    [TPlayerKey: string]: PlayerScoreHistory;
}
