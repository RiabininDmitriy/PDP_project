import { Injectable } from '@nestjs/common';
import { BattleLog } from 'src/entities/battle-log.entity';
import { BattleLogRepository } from './battleLog.repo';
import { logger, WinstonLoggerService } from 'src/utils/logger.service';
import { BattleLogDto } from './dto/battle_log.dto';
import { CREATE_BATTLE_LOG, GETTING_USER_BATTLES, SAVE_BATTLE_LOG } from './constants';
@Injectable()
export class BattleLogService {
  constructor(
    private readonly battleLogRepository: BattleLogRepository,
    private readonly logger: WinstonLoggerService,
  ) {
    this.logger.setContext('BattleLogService');
  }

	async createBattleLog(battleLogData: Partial<BattleLog>): Promise<BattleLog> {
		const battleLog = await this.battleLogRepository.createBattleLog(battleLogData);
		this.logger.log(`${CREATE_BATTLE_LOG} ${battleLog}`);
		return this.battleLogRepository.saveBattleLog(battleLog);
	}

	async saveBattleLog(battleLog: BattleLog): Promise<BattleLog> {
		this.logger.log(`${SAVE_BATTLE_LOG} ${battleLog}`);
		return this.battleLogRepository.saveBattleLog(battleLog);
	}


	async getUserBattles(userId: string): Promise<BattleLogDto[]> {
		this.logger.log(`${GETTING_USER_BATTLES} ${userId}`);
		const battleLogs = await this.battleLogRepository.findBattlesByUserIdASC(userId);
		const grouped = battleLogs.reduce((acc, log) => {
			const battleId = log.battle.id;
			if (!acc[battleId]) {
				acc[battleId] = [];
			}
			acc[battleId].push(log);
			return acc;
		}, {});

		return Object.values(grouped);
	}
}