import { Controller, Post, Param, Get, ParseUUIDPipe } from '@nestjs/common';
import { BattleService } from './battle.service';
import { logger } from 'src/utils/logger.service';
import { CharactersRepository } from '../characters/characters.repo';

@Controller('battle')
export class BattleController {
  constructor(
		private readonly battleService: BattleService, 
		private readonly charactersRepository: CharactersRepository
	) {}

	@Post('find-opponent/:characterId')
  async findOpponent(@Param('characterId') characterId: string) {
		logger.log('findOpponent',characterId);

    return this.battleService.findOpponentAndStartBattle(characterId);
  }

  @Post('round/:battleId')
  async processRound(@Param('battleId', ParseUUIDPipe) battleId: string) {
		logger.log('processRound',battleId);

    return await this.battleService.processBattleRound(battleId);
  }

  @Get('status/:battleId')
  async getBattleStatus(@Param('battleId', ParseUUIDPipe) battleId: string) {
		logger.log('getBattleStatus',battleId);

    return await this.battleService.getBattleStatus(battleId);
  }

	@Post('start/:battleId')
	async startBattle(@Param('battleId') battleId: string) {
			const battleStatus = await this.battleService.getBattleStatus(battleId);
			logger.log('startBattle', battleStatus);
	
			if (battleStatus.status === 'error') {
					logger.error('Battle not found');
					return { status: 'error', message: 'Battle not found' };
			}
	
			if (battleStatus.status === 'in_progress') {
					logger.log('Battle in progress');
					// Fetch winner's name dynamically
					const winnerName = battleStatus.battle.winnerId 
							? (await this.charactersRepository.findOne({ where: { id: battleStatus.battle.winnerId } })).user.username
							: null;
	
					// Return both the battle status and winner info
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
					winnerName: battleStatus.battle.winnerId 
							? (await this.charactersRepository.findOne({ where: { id: battleStatus.battle.winnerId } })).user.username
							: null,
			};
	}
}