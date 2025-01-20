import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { CharacterClass } from 'src/modules/characters/characters.types';

@Entity()
export class Character {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: CharacterClass })
  classType: CharacterClass;

  @Column({ default: 100 }) // Base HP value
  hp: number;

  @Column({ default: 10 }) // Normal attack
  normalAttack: number;

  @Column({ default: 20 }) // Strong attack
  heavyAttack: number;

  @Column({ default: 5 }) // Defense
  defense: number;

  @Column({ default: 0 }) // Money
  money: number;

  @Column({ default: 1 }) // Level
  level: number;

  @Column({ default: 0 }) // Gear score
  gearScore: number;

  @Column({ default: '' }) // Image URL
  imageUrl: string;

  @ManyToOne(() => User, (user) => user.characters, { eager: true })
  user: User;
}