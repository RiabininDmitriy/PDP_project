import { Controller, Post, Param, Get, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { BattleService } from './battle.service';
import { logger } from 'src/utils/logger.service';
import { AuthGuard } from '@nestjs/passport';
import { PersonalGuard } from 'src/utils/auth/guards/personal_guard';
import { BattleStatusResponseDto } from './dto/battle.dto';

@Controller('battle')
export class BattleController {
  constructor(private readonly battleService: BattleService) {}

  // This route processes a battle round by calculating damage and updating the battle status.
  @UseGuards(AuthGuard('jwt'), PersonalGuard)
  @Post('users/:userId/characters/:characterId/battle/:battleId/round')
  async processRound(@Param('battleId', ParseUUIDPipe) battleId: string, @Param('userId') userId: string): Promise<BattleStatusResponseDto> {
    logger.log('processRound', battleId);

    return await this.battleService.processBattleRound(battleId);
  }

  // This route checks the current status of a battle (whether it's finished or in progress).
  @UseGuards(AuthGuard('jwt'), PersonalGuard)
  @Get('users/:userId/characters/:characterId/battle/:battleId/status')
  async getBattleStatus(@Param('battleId', ParseUUIDPipe) battleId: string, @Param('userId') userId: string): Promise<BattleStatusResponseDto> {
    logger.log('getBattleStatus', battleId);

    return await this.battleService.getBattleStatus(battleId);
  }

  // This route starts the battle if it's not already finished and provides the winner details.
  @UseGuards(AuthGuard('jwt'), PersonalGuard)
  @Post('users/:userId/characters/:characterId/battle/:battleId/start')
  async startBattle(@Param('battleId') battleId: string, @Param('userId') userId: string): Promise<BattleStatusResponseDto> {
    const battleStatus = await this.battleService.getBattleStatus(battleId);
    logger.log('startBattle', battleStatus);

    return battleStatus;
  }

  @UseGuards(AuthGuard('jwt'), PersonalGuard)
  @Get('users/:userId/opponent/:opponentId/getBattleId')
  getBattleId(@Param('userId') userId: number, @Param('opponentId') opponentId: string): Promise<BattleStatusResponseDto> {
    logger.log('getBattleId', userId);

    return this.battleService.startBattle(userId, opponentId);
  }
}
