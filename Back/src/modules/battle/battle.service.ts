import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Battle } from 'src/entities/battle.entity';
import { BattleLog } from 'src/entities/battle-log.entity';
import { Character } from 'src/entities/character.entity';
import { CharacterService } from '../characters/characters.service';
import { logger } from 'src/utils/logger.service';
import { BattleRepository } from './battle.repo';
import { BattleStatus, BattleStatusResponseDto } from './dto/battle.dto';
import {
  BATTLE_FINISHED_MESSAGE,
  BATTLE_IN_PROGRESS_MESSAGE,
  BATTLE_NOT_FOUND_MESSAGE,
  BATTLE_STARTED_MESSAGE,
  LOSER_EXPERIENCE_POINTS,
  WINNER_EXPERIENCE_POINTS,
} from './constants';
import { BattleLogService } from '../battleLog/battleLog.service';

@Injectable()
export class BattleService {
  constructor(
    private readonly battleRepository: BattleRepository,

    private readonly battleLogService: BattleLogService,

    private readonly characterService: CharacterService,

    private readonly entityManager: EntityManager,
  ) {}
  //change startBattle на createBattle
  async startBattle(userId: number, opponentId: string): Promise<Battle> {
    const player = await this.characterService.getCharacter(userId);
    const opponent = await this.characterService.getOpponent(opponentId);
    const battle = await this.battleRepository.createBattle(player, opponent.opponent);

    logger.log(BATTLE_STARTED_MESSAGE, battle);

    return battle;
  }

  // Method to get the status of a battle by battleId and currentRound
  async getBattleStatus(battleId: string, currentRound: number): Promise<BattleStatusResponseDto> {
    const battle = await this.battleRepository.findBattleWithLogs(battleId);
    if (!battle) {
      logger.error(BATTLE_NOT_FOUND_MESSAGE);
      return { status: BattleStatus.Error, message: BATTLE_NOT_FOUND_MESSAGE };
    }

    const battleLogs = Array.isArray(battle.logs) ? battle.logs : [];
    const roundLogs = battleLogs.filter(log => Number(log.round) === Number(currentRound));

    const roundLog = roundLogs.length > 0 ? roundLogs[0] : null;

    if (!roundLog) {
      throw new Error('Round not found');
    }

    const isFinished = roundLog.attackerHp <= 0 || roundLog.defenderHp <= 0 ? true : false;

    if (battle.winnerId && isFinished) {
      const winner = battle.winnerId === battle.playerOne.id ? battle.playerOne : battle.playerTwo;
      const loser = winner.id === battle.playerOne.id ? battle.playerTwo : battle.playerOne;
      return {
        status: BattleStatus.Finished,
        message: BATTLE_FINISHED_MESSAGE,
        roundLog,
        winner: {
          id: winner.id,
          name: winner.user.username,
          experienceGained: WINNER_EXPERIENCE_POINTS,
          currentLevel: winner.level,
        },
        loser: {
          id: loser.id,
          name: loser.user.username,
          experienceGained: LOSER_EXPERIENCE_POINTS,
          currentLevel: loser.level,
        },
      };
    }

    return {
      status: BattleStatus.InProgress,
      message: BATTLE_IN_PROGRESS_MESSAGE,
      roundLog,
    };
  }

  // Method to process a battle round automatically
  async processBattleRound(battleId: string): Promise<{ battle: Battle; rounds: number }> {
    const battle = await this.battleRepository.getBattleById(battleId);

    if (!battle || battle.winnerId) return { battle, rounds: 0 };

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

      let battleLog = await this.battleLogService.createBattleLog({
        battle,
        attacker,
        attackerName: attacker.user.username,
        attackerHp: battle.playerOneHp,
        defender,
        defenderName: defender.user.username,
        defenderHp: battle.playerTwoHp,
        damage,
        round: roundNumber,
      });

      await this.battleLogService.saveBattleLog(battleLog);

      if (battle.playerOneHp <= 0 || battle.playerTwoHp <= 0) {
        const winner = battle.playerOneHp > 0 ? battle.playerOne : battle.playerTwo;
        battleFinished = true;
        const finishedBattle = await this.finishBattle(battle, winner);
        return { battle: finishedBattle, rounds: roundNumber };
      }
    }

    return { battle: await this.battleRepository.saveBattle(battle), rounds: roundNumber };
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
