import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './entities/user.entity';
import { Character } from './entities/character.entity';
import { Battle } from './entities/battle.entity';
import { BattleLog } from './entities/battle-log.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE as 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  entities: [User, Character, Battle, BattleLog],
  migrations: ['Back/src/migrations/*.ts'],
  schema: 'public',
  logging: true,
});
