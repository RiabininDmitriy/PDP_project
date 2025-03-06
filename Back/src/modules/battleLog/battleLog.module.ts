
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BattleLog } from 'src/entities/battle-log.entity';
import { BattleLogService } from './battleLog.service';
import { BattleLogRepository } from './battleLog.repo';
import { BattleLogController } from './battleLog.controller';
import { UserModule } from '../user/user.module';
import { WinstonLoggerService } from 'src/utils/logger.service';
@Module({
    imports: [TypeOrmModule.forFeature([BattleLog]), UserModule],
    controllers: [BattleLogController],
    providers: [BattleLogService, BattleLogRepository, WinstonLoggerService],
  })
  export class BattleLogModule {}
