import { Controller, Post, Param, Get, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { BattleService } from './battle.service';
import { WinstonLoggerService } from 'src/utils/logger.service';
import { AuthGuard } from '@nestjs/passport';
import { PersonalGuard } from 'src/utils/auth/guards/personal_guard';
import { BattleStatusResponseDto, BattleDto } from './dto/battle.dto';
import { Battle } from 'src/entities/battle.entity';
import { CREATING_BATTLE, GETTING_BATTLE_STATUS } from './constants';
import { PROCESSING_BATTLE_ROUND } from './constants';

@Controller('battle')
export class BattleController {
  constructor(private readonly battleService: BattleService, private readonly logger: WinstonLoggerService) { 
    this.logger.setContext('BattleController');
  }

  @UseGuards(AuthGuard('jwt'), PersonalGuard)
  @Post('users/:userId/characters/:characterId/battle/:battleId/round')
  async processRound(
    @Param('battleId', ParseUUIDPipe) battleId: string,
    @Param('userId') userId: string,
  ): Promise<{ battle: Battle; rounds: number }> {
    this.logger.log(`${PROCESSING_BATTLE_ROUND} ${battleId}`);

    return await this.battleService.processBattleRound(battleId, userId);
  }

  @UseGuards(AuthGuard('jwt'), PersonalGuard)
  @Get('users/:userId/characters/:characterId/battle/:battleId/round/:currentRound/status')
  async getBattleStatus(
    @Param('battleId', ParseUUIDPipe) battleId: string,
    @Param('userId') userId: string,
    @Param('currentRound') currentRound: number,
  ): Promise<BattleStatusResponseDto> {
    this.logger.log(`${GETTING_BATTLE_STATUS} ${battleId}`);

    return await this.battleService.getBattleStatus(battleId, currentRound);
  }

  @UseGuards(AuthGuard('jwt'), PersonalGuard)
  @Post('users/:userId/opponent/:opponentId/battle')
  createBattle(
    @Param('userId') userId: string, 
    @Param('opponentId') opponentId: string
  ): Promise<BattleDto> {
    this.logger.log(`${CREATING_BATTLE} ${userId}`);
    return this.battleService.createBattle(userId, opponentId);
  }
}
