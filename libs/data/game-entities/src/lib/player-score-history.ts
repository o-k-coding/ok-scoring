import { Player, PlayerScoreHistory } from '@ok-scoring/data/game-models';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { GameStateEntity } from './game';
import { PlayerEntity } from './player';
import { ScoreRoundEntity } from './score-round';

@Entity()
export class PlayerScoreHistoryEntity implements PlayerScoreHistory {

    @PrimaryColumn()
    key: string;

    @ManyToOne('PlayerEntity')
    @JoinColumn({ name: 'playerKey' })
    player: Player;

    playerKey: string;

    @ManyToOne('GameStateEntity', 'scoreHistory')
    @JoinColumn({ name: 'gameKey' })
    game: GameStateEntity;

    gameKey: string;

    @OneToMany('ScoreRoundEntity', 'playerScoreHistory')
    scores: ScoreRoundEntity[];

    @Column()
    score: number;

    @Column()
    initialScore?: number;

    @Column()
    order: number;
}
