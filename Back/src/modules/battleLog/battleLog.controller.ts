import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { BattleLogService } from './battleLog.service';
import { BattleLog } from 'src/entities/battle-log.entity';
import { WinstonLoggerService } from 'src/utils/logger.service';
import { BattleLogDto } from './dto/battle_log.dto';
import { PersonalGuard } from 'src/utils/auth/guards/personal_guard';
import { AuthGuard } from '@nestjs/passport';
import { GETTING_USER_BATTLES } from './constants';
import { CREATE_BATTLE_LOG } from './constants';

@Controller('battle-logs')
export class BattleLogController {
  constructor(private readonly battleLogService: BattleLogService, private readonly logger: WinstonLoggerService) {
    this.logger.setContext('BattleLogController');
  }

  @UseGuards(AuthGuard('jwt'), PersonalGuard)
  @Post(':battleId')
  createBattleLog(@Param('battleId') battleId: string, @Body() battleLogData: Partial<BattleLog>): Promise<BattleLog> {
    this.logger.log(`${CREATE_BATTLE_LOG} ${battleId}`);
    return this.battleLogService.createBattleLog(battleLogData);
  }
  
  @UseGuards(AuthGuard('jwt'), PersonalGuard)
  @Get('users/:userId')
  getUserBattles(@Param('userId') userId: string): Promise<BattleLogDto[]> {
    this.logger.log(`${GETTING_USER_BATTLES} ${userId}`);
    return this.battleLogService.getUserBattles(userId);
  }
}
