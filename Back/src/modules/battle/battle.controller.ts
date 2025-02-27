import { Controller, Post, Param, Get, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { BattleService } from './battle.service';
import { logger } from 'src/utils/logger.service';
import { AuthGuard } from '@nestjs/passport';
import { PersonalGuard } from 'src/utils/auth/guards/personal_guard';
import { BattleStatusResponseDto } from './dto/battle.dto';
import { Battle } from 'src/entities/battle.entity';

@Controller('battle')
export class BattleController {
  constructor(private readonly battleService: BattleService) { }

  // This route processes a battle round by calculating damage and updating the battle status.
  @UseGuards(AuthGuard('jwt'), PersonalGuard)
  @Post('users/:userId/characters/:characterId/battle/:battleId/round')
  async processRound(
    @Param('battleId', ParseUUIDPipe) battleId: string,
    @Param('userId') userId: string,
  ): Promise<{ battle: Battle; rounds: number }> {
    logger.log('processRound', battleId);

    return await this.battleService.processBattleRound(battleId, userId);
  }

  // This route checks the current status of a battle (whether it's finished or in progress).
  @UseGuards(AuthGuard('jwt'), PersonalGuard)
  @Get('users/:userId/characters/:characterId/battle/:battleId/round/:currentRound/status')
  async getBattleStatus(
    @Param('battleId', ParseUUIDPipe) battleId: string,
    @Param('userId') userId: string,
    @Param('currentRound') currentRound: number,
  ): Promise<BattleStatusResponseDto> {
    logger.log('getBattleStatus', battleId);

    return await this.battleService.getBattleStatus(battleId, currentRound);
  }

  @UseGuards(AuthGuard('jwt'), PersonalGuard)
  //change  getBattleId на battle/ and change on POST
  @Get('users/:userId/opponent/:opponentId/getBattleId')
  //change getBattleId на createBattle
  getBattleId(@Param('userId') userId: string, @Param('opponentId') opponentId: string): Promise<Battle> {
    logger.log('getBattleId', userId);

    return this.battleService.startBattle(userId, opponentId);
  }
}
