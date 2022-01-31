import { DealerSettings } from '..';

export interface GameRulesTemplate {
  key: string;
  playerKey: string;
  description: string;

  // JSON Schema properties
  validStateSchema?: {};
  winningSchema?: {};

  // Custom properties cannot be handled by JSON schema right now for validation
  dealerSettings?: DealerSettings;
  firstToScoreWins?: boolean;
  highScoreWins?: boolean
  playersMustBeOnSameRound?: boolean;
  archived: boolean;
  createdAt: Date;
}
