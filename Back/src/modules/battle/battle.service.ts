import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Battle } from 'src/entities/battle.entity';
import { BattleLog } from 'src/entities/battle-log.entity';
import { Character } from 'src/entities/character.entity';
import { CharacterService } from '../characters/characters.service';
import { logger } from 'src/utils/logger.service';
import { BattleRepository } from './battle.repo';
import { BattleStatusResponseDto, FindOpponentResponseDto } from './dto/battle.dto';

@Injectable()
export class BattleService {
  constructor(
    private readonly battleRepository: BattleRepository,

    @InjectRepository(BattleLog)
    private readonly battleLogRepository: Repository<BattleLog>,

    private readonly characterService: CharacterService,

    private readonly entityManager: EntityManager
  ) {}

  // Method to find an opponent for the given character and start a battle
  async findOpponentAndStartBattle(characterId: string): Promise<FindOpponentResponseDto> {
    const player = await this.battleRepository.findCharacterById(characterId);
    logger.log('findOpponentAndStartBattle', characterId);

    if (!player) {
      logger.error('Player not found');
      return { status: 'error', message: 'Player not found' };
    }

    // Find potential opponents based on gear score
    const opponents = await this.battleRepository.findOpponents(characterId, player.gearScore);

    // If no opponents are found, return 'searching' status
    if (opponents.length === 0) {
      return { status: 'searching' };
    }

    // Randomly select an opponent
    const randomOpponent = opponents[Math.floor(Math.random() * opponents.length)];

    // Create a battle between the player and the opponent
    const battle = await this.battleRepository.createBattle(player, randomOpponent);

    return { status: 'found', battleId: battle.id };
  }

  // Method to get the status of a battle
  async getBattleStatus(battleId: string): Promise<BattleStatusResponseDto> {
    const battle = await this.battleRepository.getBattleById(battleId);

    if (!battle) {
      logger.error('Battle not found');
      return { status: 'error', message: 'Battle not found' };
    }

    let winnerName = null;
    // If there's a winner, fetch the winner's name
    if (battle.winnerId) {
      winnerName = await this.getWinnerName(battle.winnerId);
    }

    if (battle.winnerId) {
      logger.log('Battle finished');
      return {
        status: 'finished',
        winnerId: battle.winnerId,
        winnerName,
        battle: battle,
      };
    }

    logger.log('Battle in progress');
    return { status: 'in_progress', battle, winnerName };
  }

  // Helper method to get the winner's name from their ID
  async getWinnerName(winnerId: string): Promise<string | null>  {
    const winner = await this.battleRepository.findCharacterById(winnerId);
    return winner ? winner.user.username : null;
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
      await this.characterService.addExperience(winner.id, 100, manager);
      await this.characterService.addExperience(loser.id, 50, manager);
      return battle;
    });

    logger.log('Battle finished', transactionResult);
    return transactionResult;
  }
}