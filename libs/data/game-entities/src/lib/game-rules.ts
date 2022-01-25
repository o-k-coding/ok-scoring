import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { DealerSettings, GameRules, GameState } from '@ok-scoring/data/game-models';
import { GameStateEntity } from './game';

@Entity({ name: 'game_rules' })
export class GameRulesEntity implements GameRules {
    @PrimaryColumn()
    key: string;

    // Need to use strings and interfaces to define relationships, otherwise we get errors related to classes being referenced before they are
    // Initialized, despite efforts to export and import in the correct order
    @OneToOne('GameStateEntity', 'rules')
    @JoinColumn({ name: 'gameKey' })
    game: GameState;

    // No column mapping needed, the @JoinColumn above will create the DB column, this just gives the property
    gameKey?: string;

    @Column('json')
    validStateSchema?: {};

    @Column('json')
    winningSchema?: {};

    @Column()
    firstToScoreWins?: boolean;

    @Column()
    dealerSettings?: DealerSettings;

    @Column()
    highScoreWins?: boolean;

    @Column()
    playersMustBeOnSameRound?: boolean;
}
