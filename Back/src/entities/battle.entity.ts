import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Character } from './character.entity';
import { BattleLog } from './battle-log.entity';
import { User } from './user.entity';

@Entity()
export class Battle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  battleCreatorId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'battleCreatorId' })
  battleCreator: User;

  @ManyToOne(() => Character)
  playerOne: Character;

  @ManyToOne(() => Character)
  playerTwo: Character;

  @Column({ default: 0 })
  playerOneHp: number;

  @Column({ default: 0 })
  playerTwoHp: number;

  @Column({ nullable: true })
  winnerId: string;

  @OneToMany(() => BattleLog, (log) => log.battle)
  logs: BattleLog[];

  @Column({ nullable: true })
  winnerName: string;
}