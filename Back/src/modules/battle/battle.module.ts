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

@Module({
    imports: [TypeOrmModule.forFeature([Character, BattleLog, Battle]), UserModule],
    controllers: [BattleController],
    providers: [BattleService, CharactersRepository, CharacterService, BattleRepository],
  })
  export class BattleModule {}
