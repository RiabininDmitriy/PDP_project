import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  password: string;

  @Index('IDX_username', { synchronize: false })
  @Column({ unique: true })
  username: string;
}
