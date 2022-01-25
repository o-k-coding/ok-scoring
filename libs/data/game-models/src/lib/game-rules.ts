import { DealerSettings } from './dealer-settings';

export interface GameRules {
    key: string;
    gameKey?: string;

    // JSON Schema properties
    validStateSchema?: {};
    winningSchema?: {};

    // Custom properties cannot be handled by JSON schema right now for validation
    firstToScoreWins?: boolean;
    dealerSettings?: DealerSettings;
    highScoreWins?: boolean
    playersMustBeOnSameRound?: boolean;
}
