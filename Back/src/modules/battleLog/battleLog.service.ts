
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
}