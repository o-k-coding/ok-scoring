import { Entity, PrimaryColumn, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { GameRules, GameState, PlayerScoreHistory } from '@ok-scoring/data/game-models';
import { unzip } from 'zlib';
unzip
@Entity()
export class GameStateEntity implements GameState {
    @PrimaryColumn()
    key: string;

    @Column()
    date: number;

    @Column()
    duration: number;

    // TODO these need to be foreign keys
    @Column()
    winningPlayerKey: string;

    @Column()
    activePlayerKey?: string;

    @Column()
    description: string;

    @OneToOne('GameRulesEntity', 'game')
    @JoinColumn({ name: 'rulesKey' })
    rules?: GameRules;

    rulesKey?: string;

    @OneToMany('PlayerScoreHistoryEntity', 'game')
    scoreHistory: PlayerScoreHistory[]
}
