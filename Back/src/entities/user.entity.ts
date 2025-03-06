import { Entity, PrimaryGeneratedColumn, Column, Index, OneToMany } from 'typeorm';
import { Character } from './character.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  password: string;

  @Index('IDX_username', { synchronize: false })
  @Column({ unique: true })
  username: string;

  @OneToMany(() => Character, (character) => character.user)
  characters: Character[];
}
