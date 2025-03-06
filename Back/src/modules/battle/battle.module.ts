import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BattleService } from './battle.service';
import { BattleController } from './battle.controller';
import { CharactersRepository } from '../characters/characters.repo';
import { BattleLog } from 'src/entities/battle-log.entity';
import { Character } from 'src/entities/character.entity';
import { Battle } from 'src/entities/battle.entity';
import { CharacterService } from '../characters/characters.service';
import { UserModule } from '../user/user.module';
import { BattleRepository } from './battle.repo';
import { BattleLogService } from '../battleLog/battleLog.service';
import { BattleLogRepository } from '../battleLog/battleLog.repo';
import { WinstonLoggerService } from 'src/utils/logger.service';
@Module({
    imports: [TypeOrmModule.forFeature([Character, Battle, BattleLog]), UserModule],
    controllers: [BattleController],
    providers: [BattleService, CharactersRepository, CharacterService, BattleRepository, BattleLogService, BattleLogRepository, WinstonLoggerService],
  })
  export class BattleModule {}
