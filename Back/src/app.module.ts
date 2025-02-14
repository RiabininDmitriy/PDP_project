/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AppService } from './app.service';
import { UserRepository } from './modules/user/user.repo';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserController } from './modules/user/user.controller';
import { UserService } from './modules/user/user.service';
import { AuthController } from './modules/auth/auth.controller';
import { AuthService } from './modules/auth/auth.service';
import { WinstonLoggerService } from './utils/logger.service';
import * as dotenv from 'dotenv';
import { CharacterController } from './modules/characters/characters.controller';
import { CharacterService } from './modules/characters/characters.service';
import { CharacterModule } from './modules/characters/characters.module';
import { Character } from './entities/character.entity';
import { CharactersRepository } from './modules/characters/characters.repo';
import { BattleService } from './modules/battle/battle.service';
import { BattleModule } from './modules/battle/battle.module';
import { BattleController } from './modules/battle/battle.controller';
import { Battle } from './entities/battle.entity';
import { BattleLog } from './entities/battle-log.entity';
import { BattleRepository } from './modules/battle/battle.repo';

dotenv.config();
@Module({
  imports: [
    TypeOrmModule.forRoot(
      {
        type: process.env.DB_TYPE as 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        entities: [User, Character, Battle, BattleLog],
        synchronize: false,
      }
    ),
    TypeOrmModule.forFeature([User, Character, Battle, BattleLog]),
    UserModule,
    AuthModule,
    CharacterModule,
    BattleModule,
  ],
  controllers: [UserController, AuthController, CharacterController, BattleController],
  providers: [
    AppService,
    UserService,
    UserRepository,
    AuthService,
    WinstonLoggerService,
    CharacterService,
    CharactersRepository,
    BattleService,
    BattleRepository,
  ],
})
export class AppModule { }
