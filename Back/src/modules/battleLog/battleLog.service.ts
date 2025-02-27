import { Injectable } from '@nestjs/common';
import { BattleLog } from 'src/entities/battle-log.entity';
import { BattleLogRepository } from './battleLog.repo';

@Injectable()
export class BattleLogService {
  constructor(
    private readonly battleLogRepository: BattleLogRepository,
  ) {}

	async createBattleLog(battleLogData: Partial<BattleLog>): Promise<BattleLog> {
		const battleLog = await this.battleLogRepository.createBattleLog(battleLogData);
		return this.battleLogRepository.saveBattleLog(battleLog);
	}

	async saveBattleLog(battleLog: BattleLog): Promise<BattleLog> {
		return this.battleLogRepository.saveBattleLog(battleLog);
	}

	async getUserBattles(userId: string): Promise<BattleLog[][]> {
		const battleLogs = await this.battleLogRepository.findBattlesByUserId(userId);

		console.log(battleLogs);
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