import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BattleLogService } from './battleLog.service';
import { BattleLog } from 'src/entities/battle-log.entity';

@Controller('battle-logs')
export class BattleLogController {
  constructor(private readonly battleLogService: BattleLogService) {}

  @Post(':battleId')
  createBattleLog(@Param('battleId') battleId: string, @Body() battleLogData: Partial<BattleLog>) {
    return this.battleLogService.createBattleLog(battleLogData);
  }

  @Get('user/:userId')
  getUserBattles(@Param('userId') userId: string) {
    return this.battleLogService.getUserBattles(userId);
  }
}
