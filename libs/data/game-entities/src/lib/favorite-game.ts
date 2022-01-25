import { FavoriteGame } from '@ok-scoring/data/game-models';
import { Column, Entity, PrimaryColumn, Unique } from 'typeorm';

@Entity()
@Unique(['description'])
export class FavoriteGameEntity implements FavoriteGame {

    @PrimaryColumn()
    key: string;

    @Column()
    description: string;
}
