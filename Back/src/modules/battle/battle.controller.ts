import { Controller, Post, Param, Get, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { BattleService } from './battle.service';
import { logger } from 'src/utils/logger.service';
import { AuthGuard } from '@nestjs/passport';
import { PersonalGuard } from 'src/utils/auth/guards/personal_guard';
import { BattleStatusResponseDto, FindOpponentResponseDto } from './dto/battle.dto';

@Controller('battle')
export class BattleController {
  constructor(private readonly battleService: BattleService) {}

  // This route is used to find an opponent for a character and start a battle.
  @UseGuards(AuthGuard('jwt'), PersonalGuard)
  @Post('find-opponent/:userId/:characterId')
  async findOpponent(@Param('characterId') characterId: string, @Param('userId') userId: string): Promise<FindOpponentResponseDto> {
    logger.log('findOpponent', characterId);

    return this.battleService.findOpponentAndStartBattle(characterId);
  }

  // This route processes a battle round by calculating damage and updating the battle status.
  @UseGuards(AuthGuard('jwt'), PersonalGuard)
  @Post('round/:userId/:battleId')
  async processRound(@Param('battleId', ParseUUIDPipe) battleId: string, @Param('userId') userId: string): Promise<BattleStatusResponseDto> {
    logger.log('processRound', battleId);

    return await this.battleService.processBattleRound(battleId);
  }

  // This route checks the current status of a battle (whether it's finished or in progress).
  @UseGuards(AuthGuard('jwt'), PersonalGuard)
  @Get('status/:userId/:battleId')
  async getBattleStatus(@Param('battleId', ParseUUIDPipe) battleId: string, @Param('userId') userId: string): Promise<BattleStatusResponseDto> {
    logger.log('getBattleStatus', battleId);

    return await this.battleService.getBattleStatus(battleId);
  }

  // This route starts the battle if it's not already finished and provides the winner details.
  @UseGuards(AuthGuard('jwt'), PersonalGuard)
  @Post('start/:userId/:battleId')
  async startBattle(@Param('battleId') battleId: string, @Param('userId') userId: string): Promise<BattleStatusResponseDto> {
    const battleStatus = await this.battleService.getBattleStatus(battleId);
    logger.log('startBattle', battleStatus);

    if (battleStatus.status === 'error') {
      logger.error('Battle not found');
      return { status: 'error', message: 'Battle not found' };
    }

    if (battleStatus.status === 'in_progress') {
      logger.log('Battle in progress');
      const winnerName = battleStatus.winnerId
        ? (await this.battleService.getWinnerName(battleStatus.winnerId))
        : null;

      return {
        status: 'in_progress',
        battleId: battleStatus.battle.id,
        winnerId: battleStatus.battle.winnerId,
        winnerName,
      };
    }

    logger.log('Battle finished');
    return {
      status: 'finished',
      winnerId: battleStatus.battle.winnerId,
      winnerName: battleStatus.winnerId
        ? await this.battleService.getWinnerName(battleStatus.battle.winnerId)
        : null,
    };
  }
}