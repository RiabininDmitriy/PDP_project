import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Battle } from 'src/entities/battle.entity';
import { BattleLog } from 'src/entities/battle-log.entity';
import { Character } from 'src/entities/character.entity';
import { CharacterService } from '../characters/characters.service';
import { logger } from 'src/utils/logger.service';
import { BattleRepository } from './battle.repo';

@Injectable()
export class BattleService {
  constructor(
    private readonly battleRepository: BattleRepository,

    @InjectRepository(BattleLog)
    private readonly battleLogRepository: Repository<BattleLog>,

    private readonly characterService: CharacterService,

    private readonly entityManager: EntityManager,

  ) {}

// In BattleService:
  async findOpponentAndStartBattle(characterId: string) {

    const player = await this.battleRepository.findCharacterById(characterId);
    
    logger.log('findOpponentAndStartBattle', characterId);

    if (!player) {
      logger.error('Player not found');
      return { status: 'error', message: 'Player not found' };
    }

    const opponents = await this.battleRepository.findOpponents(characterId, player.gearScore);

    if (opponents.length === 0) {
      return { status: 'searching' }; 
    }

    const randomOpponent = opponents[Math.floor(Math.random() * opponents.length)];

    const battle = await this.battleRepository.createBattle(player, randomOpponent);

    return { status: 'found', battleId: battle.id };
  }

  async getBattleStatus(battleId: string) {
    const battle = await this.battleRepository.getBattleById(battleId);

    if (!battle) {
      logger.error('Battle not found');
      return { status: 'error', message: 'Battle not found' };
    }

    let winnerName = null;

    if (battle.winnerId) {
      const winner = await this.battleRepository.findCharacterById(battle.winnerId);
      winnerName = winner ? winner.user.username : null;
    }

    if (battle.winnerId) {
      logger.log('Battle finished');
      return { 
        status: 'finished', 
        winnerId: battle.winnerId, 
        winnerName: winnerName,
        battle: battle
      };
    }

    logger.log('Battle in progress');
    return { status: 'in_progress', battle, winnerName: winnerName };
  }

  async processBattleRound(battleId: string) {
    const battle = await this.battleRepository.getBattleById(battleId);


    if (!battle || battle.winnerId) return battle;

    const attacker = Math.random() < 0.5 ? battle.playerOne : battle.playerTwo;
    const defender = attacker === battle.playerOne ? battle.playerTwo : battle.playerOne;
    const damage = Math.floor(Math.random() * (attacker.normalAttack - 2)) + 2;

    // Apply damage
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

    // If either player's health reaches 0, finish the battle
    if (battle.playerOneHp <= 0 || battle.playerTwoHp <= 0) {
      const winner = battle.playerOneHp > 0 ? battle.playerOne : battle.playerTwo;
      return await this.finishBattle(battle, winner);
    }

    // Save the battle state after the round
    return await this.battleRepository.saveBattle(battle);
  }

  private async finishBattle(battle: Battle, winner: Character) {
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