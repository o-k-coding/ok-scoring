import { DealerSettings } from './dealer-settings';
import { JSONSchemaType } from 'ajv';
import { GameState } from './game-state';

export interface GameRules {
    key: string;
    gameKey?: string;
    dealerSettings?: DealerSettings;
    highScoreWins?: boolean
    firstToScoreWins?: boolean;

    // Note this is tying the implementation directly to ajv... something to think about
    validStateSchema?: {};
    winningSchema?: {};

    startingScore?: number;
    defaultScoreStep?: number;
}
