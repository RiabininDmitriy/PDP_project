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
import { BATTLE_FINISHED_MESSAGE, BATTLE_IN_PROGRESS_MESSAGE, BATTLE_NOT_FOUND_MESSAGE, BATTLE_STARTED_MESSAGE, LOSER_EXPERIENCE_POINTS, WINNER_EXPERIENCE_POINTS } from './constants';

@Injectable()
export class BattleService {
  constructor(
    private readonly battleRepository: BattleRepository,

    // TODO: move logic into repo (BATTLE LOG)
    @InjectRepository(BattleLog)
    private readonly battleLogRepository: Repository<BattleLog>,

    private readonly characterService: CharacterService,

    private readonly entityManager: EntityManager
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
    const battle = await this.battleRepository.getBattleById(battleId);

    if (!battle) {
      logger.error(BATTLE_NOT_FOUND_MESSAGE);
      return { status: BattleStatus.Error, message: BATTLE_NOT_FOUND_MESSAGE };
    }

    let winnerName = null;
  
    if (battle.winnerId) {
      winnerName = await this.characterService.getWinnerName(battle.winnerId);
    }

    if (battle.winnerId) {

      logger.log(BATTLE_FINISHED_MESSAGE);

      return {
        status: BattleStatus.Finished,
        winnerId: battle.winnerId,
        winnerName,
        battle: battle,
      };
    }
    

    logger.log(BATTLE_IN_PROGRESS_MESSAGE);

    return { status: BattleStatus.InProgress, battle, winnerName };
  }

  // Method to process a battle round (e.g., apply damage and update the battle state)
  async processBattleRound(battleId: string): Promise<Battle> {
    const battle = await this.battleRepository.getBattleById(battleId);

    if (!battle || battle.winnerId) return battle;

    const attacker = Math.random() < 0.5 ? battle.playerOne : battle.playerTwo;
    const defender = attacker === battle.playerOne ? battle.playerTwo : battle.playerOne;
    const damage = Math.floor(Math.random() * (attacker.normalAttack - 2)) + 2;

    // Apply damage to the defender's HP
    if (defender.id === battle.playerOne.id) {
      battle.playerOneHp = Math.max(0, battle.playerOneHp - damage);
    } else {
      battle.playerTwoHp = Math.max(0, battle.playerTwoHp - damage);
    }

    await this.battleLogRepository.save({
      battle,
      attacker,
      defender,
      damage,
    });

    // Check if any player has lost (HP <= 0) and finish the battle if so
    if (battle.playerOneHp <= 0 || battle.playerTwoHp <= 0) {
      const winner = battle.playerOneHp > 0 ? battle.playerOne : battle.playerTwo;

      return await this.finishBattle(battle, winner);
    }

    // Save the updated battle state
    return await this.battleRepository.saveBattle(battle);
  }

  // Method to finish the battle and award experience points to both players
  private async finishBattle(battle: Battle, winner: Character): Promise<Battle> {
    const loser = winner.id === battle.playerOne.id ? battle.playerTwo : battle.playerOne;

    battle.winnerId = winner.id;
    battle.winnerName = winner.user.username;

    const transactionResult = await this.entityManager.transaction(async (manager) => {
      await manager.save(Battle, battle);
      await this.characterService.addExperience(winner.id, WINNER_EXPERIENCE_POINTS, manager);
      await this.characterService.addExperience(loser.id, LOSER_EXPERIENCE_POINTS, manager);

      return battle;
    });

    logger.log(BATTLE_FINISHED_MESSAGE, transactionResult);

    return transactionResult;
  }
}