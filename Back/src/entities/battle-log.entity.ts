import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Battle } from './battle.entity';
import { Character } from './character.entity';

@Entity()
export class BattleLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Battle, (battle) => battle.logs)
  battle: Battle;

  @ManyToOne(() => Character)
  attacker: Character;

  @ManyToOne(() => Character)
  defender: Character;

  @Column()
  damage: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;
}