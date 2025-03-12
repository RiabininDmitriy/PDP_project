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
import { BattleLogService } from './modules/battleLog/battleLog.service';
import { BattleLogRepository } from './modules/battleLog/battleLog.repo';
import { BattleLogModule } from './modules/battleLog/battleLog.module';
import { BattleLogController } from './modules/battleLog/battleLog.controller';
import { AppDataSource } from './data-source';

dotenv.config();
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        ...AppDataSource.options
      }),
    }),
    TypeOrmModule.forFeature([User, Character, Battle, BattleLog]),
    UserModule,
    AuthModule,
    CharacterModule,
    BattleModule,
    BattleLogModule,
  ],
  controllers: [UserController, AuthController, CharacterController, BattleController, BattleLogController],
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
    BattleLogService,
    BattleLogRepository,
  ],
})
export class AppModule { }