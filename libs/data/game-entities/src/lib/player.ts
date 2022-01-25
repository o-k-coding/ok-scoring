import { Player } from '@ok-scoring/data/game-models';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class PlayerEntity implements Player {

    @PrimaryColumn()
    key: string;

    @Column()
    name: string;

    @Column()
    favorite: boolean;
}
