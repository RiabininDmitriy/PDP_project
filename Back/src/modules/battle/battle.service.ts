import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Battle } from 'src/entities/battle.entity';
import { BattleLog } from 'src/entities/battle-log.entity';
import { Character } from 'src/entities/character.entity';
import { CharacterService } from '../characters/characters.service';
import { logger } from 'src/utils/logger.service';
import { BattleRepository } from './battle.repo';
import { BattleStatus, BattleStatusResponseDto, FindOpponentResponseDto } from './dto/battle.dto';
import {
  BATTLE_FINISHED_MESSAGE,
  BATTLE_IN_PROGRESS_MESSAGE,
  BATTLE_NOT_FOUND_MESSAGE,
  BATTLE_STARTED_MESSAGE,
  LOSER_EXPERIENCE_POINTS,
  WINNER_EXPERIENCE_POINTS,
} from './constants';

@Injectable()
export class BattleService {
  constructor(
    private readonly battleRepository: BattleRepository,

    // TODO: move logic into repo (BATTLE LOG)
    @InjectRepository(BattleLog)
    private readonly battleLogRepository: Repository<BattleLog>,

    private readonly characterService: CharacterService,

    private readonly entityManager: EntityManager,
  ) {}

  async startBattle(userId: number, opponentId: string): Promise<Battle> {
    const player = await this.characterService.getCharacter(userId);
    const opponent = await this.characterService.getOpponent(opponentId);
    const battle = await this.battleRepository.createBattle(player, opponent.opponent);

    logger.log(BATTLE_STARTED_MESSAGE, battle);

    return battle;
  }

  // Method to get the status of a battle
  async getBattleStatus(battleId: string): Promise<BattleStatusResponseDto> {
    const battle = await this.battleRepository.findBattleWithLogs(battleId);

    if (!battle) {
      logger.error(BATTLE_NOT_FOUND_MESSAGE);
      return { status: BattleStatus.Error, message: BATTLE_NOT_FOUND_MESSAGE };
    }

    // Ensure battle.logs is an array before calling find or accessing length
    const battleLogs = Array.isArray(battle.logs) ? battle.logs : [];

    // If no specific log for the requested round, return the latest known status
    const latestLog = battleLogs[battleLogs.length - 1] || null;
    if (latestLog) {
      logger.log(BATTLE_IN_PROGRESS_MESSAGE);
      return {
        battle,
        currentRound: latestLog.round,
      };
    } else {
      logger.log(BATTLE_IN_PROGRESS_MESSAGE);
      return {
        battle,
      };
    }
  }

  // Method to process a battle round automatically
  async processBattleRound(battleId: string): Promise<Battle> {
    const battle = await this.battleRepository.getBattleById(battleId);

    if (!battle || battle.winnerId) return battle;

    let roundNumber = 0;
    let battleFinished = false;

    while (!battleFinished) {
      roundNumber += 1;

      const attacker = Math.random() < 0.5 ? battle.playerOne : battle.playerTwo;
      const defender = attacker === battle.playerOne ? battle.playerTwo : battle.playerOne;
      const damage = Math.floor(Math.random() * (attacker.normalAttack - 2)) + 2;

      if (defender.id === battle.playerOne.id) {
        battle.playerOneHp = Math.max(0, battle.playerOneHp - damage);
      } else {
        battle.playerTwoHp = Math.max(0, battle.playerTwoHp - damage);
      }

      let battleLog = this.battleLogRepository.create({
        battle,
        attacker,
        attackerName: attacker.user.username,
        attackerHp: attacker.hp,
        defender,
        defenderName: defender.user.username,
        defenderHp: defender.hp,
        damage,
        round: roundNumber,
      });

      await this.battleLogRepository.save(battleLog);

      if (battle.playerOneHp <= 0 || battle.playerTwoHp <= 0) {
        const winner = battle.playerOneHp > 0 ? battle.playerOne : battle.playerTwo;
        battleFinished = true;
        return await this.finishBattle(battle, winner);
      }
    }

    return await this.battleRepository.saveBattle(battle);
  }

  // Method to finish the battle and award experience points to both players
  private async finishBattle(battle: Battle, winner: Character): Promise<Battle> {
    const loser = winner.id === battle.playerOne.id ? battle.playerTwo : battle.playerOne;

    battle.winnerId = winner.id;
    battle.winnerName = winner.user.username;

    const transactionResult = await this.entityManager.transaction(async manager => {
      await manager.save(Battle, battle);
      await this.characterService.addExperience(winner.id, WINNER_EXPERIENCE_POINTS, manager);
      await this.characterService.addExperience(loser.id, LOSER_EXPERIENCE_POINTS, manager);

      return battle;
    });

    logger.log(BATTLE_FINISHED_MESSAGE, transactionResult);

    return transactionResult;
  }
}
