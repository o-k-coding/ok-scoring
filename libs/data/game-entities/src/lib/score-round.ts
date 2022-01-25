import { ScoreRound } from '@ok-scoring/data/game-models';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { PlayerScoreHistoryEntity } from './player-score-history';

@Entity()
export class ScoreRoundEntity implements ScoreRound {

    @PrimaryColumn()
    key: string;

    @ManyToOne('PlayerScoreHistoryEntity', 'scores')
    @JoinColumn({ name: 'playerScoreHistoryKey' })
    playerScoreHistory: PlayerScoreHistoryEntity;

    playerScoreHistoryKey: string;

    @Column('json')
    scores: number[];

    @Column()
    score: number;

    @Column()
    initialScore?: number;

    @Column()
    order: number;
}
