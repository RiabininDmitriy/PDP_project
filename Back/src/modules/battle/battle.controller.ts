import { Controller, Post, Param, Get, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { BattleService } from './battle.service';
import { logger } from 'src/utils/logger.service';
import { CharactersRepository } from '../characters/characters.repo';
import { AuthGuard } from '@nestjs/passport';
import { PersonalGuard } from 'src/utils/auth/guards/personal_guard';

@Controller('battle')
export class BattleController {
	constructor(
		private readonly battleService: BattleService,
		private readonly charactersRepository: CharactersRepository
	) { }

	@UseGuards(AuthGuard('jwt'), PersonalGuard)
	@Post('find-opponent/:userId/:characterId')
	async findOpponent(@Param('characterId') characterId: string, @Param('userId') userId: string) {
		logger.log('findOpponent', characterId);
		logger.log('userId', userId);

		return this.battleService.findOpponentAndStartBattle(characterId);
	}

	@UseGuards(AuthGuard('jwt'), PersonalGuard)
	@Post('round/:userId/:battleId')
	async processRound(@Param('battleId', ParseUUIDPipe) battleId: string, @Param('userId') userId: string) {
		logger.log('processRound', battleId);
		logger.log('userId', userId);
		return await this.battleService.processBattleRound(battleId);
	}

	@UseGuards(AuthGuard('jwt'), PersonalGuard)
	@Get('status/:userId/:battleId')
	async getBattleStatus(@Param('battleId', ParseUUIDPipe) battleId: string, @Param('userId') userId: string) {
		logger.log('getBattleStatus', battleId);
		logger.log('userId', userId);

		return await this.battleService.getBattleStatus(battleId);
	}

	@UseGuards(AuthGuard('jwt'), PersonalGuard)
	@Post('start/:userId/:battleId')
	async startBattle(@Param('battleId') battleId: string, @Param('userId') userId: string) {
		const battleStatus = await this.battleService.getBattleStatus(battleId);
		logger.log('startBattle', battleStatus);
		logger.log('userId', userId);
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