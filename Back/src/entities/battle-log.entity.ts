import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Battle } from './battle.entity';
import { Character } from './character.entity';
import { User } from './user.entity';

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

  @Column({ default: 1 })
  round: number;

  @Column({ nullable: true })
  attackerName: string;

  @Column({ nullable: true })
  defenderName: string;

  @Column({ nullable: true })
  attackerHp: number;

  @Column({ nullable: true })
  defenderHp: number;
}
