
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BattleLog } from 'src/entities/battle-log.entity';
import { BattleLogService } from '../battleLog/battleLog.service';
import { BattleLogRepository } from './battleLog.repo';
import { BattleLogController } from './battleLog.controller';

@Module({
    imports: [TypeOrmModule.forFeature([BattleLog])],
    controllers: [BattleLogController],
    providers: [BattleLogService, BattleLogRepository],
  })
  export class BattleLogModule {}
