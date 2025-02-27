import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BattleLog } from 'src/entities/battle-log.entity';

@Injectable()
export class BattleLogRepository extends Repository<BattleLog> {
  constructor(
    @InjectRepository(BattleLog)
    private readonly battleLogRepository: Repository<BattleLog>,
    
  ) {
    super(battleLogRepository.target, battleLogRepository.manager, battleLogRepository.queryRunner);
  }

	async createBattleLog(battleLogData: Partial<BattleLog>): Promise<BattleLog> {
		return this.battleLogRepository.create(battleLogData);
	}

	async saveBattleLog(battleLog: BattleLog): Promise<BattleLog> {
		return this.battleLogRepository.save(battleLog);
	}
}
