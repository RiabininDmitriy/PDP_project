import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Character } from './character.entity';
import { BattleLog } from './battle-log.entity';

@Entity()
export class Battle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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