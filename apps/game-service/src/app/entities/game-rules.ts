import { Entity, PrimaryColumn } from 'typeorm';
import { DealerSettings, GameRules } from '@ok-scoring/features/game-models';

@Entity({ name: 'game_rules' })
export class GameRulesEntity implements GameRules {
    @PrimaryColumn()
    key: string;
    gameKey?: string;
    startingScore?: number;
    defaultScoreStep?: number;
    highScoreWins: boolean;
    dealerSettings?: DealerSettings;
}
