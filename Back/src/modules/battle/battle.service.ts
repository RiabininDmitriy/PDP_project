import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Not } from 'typeorm';
import { Battle } from 'src/entities/battle.entity';
import { BattleLog } from 'src/entities/battle-log.entity';
import { Character } from 'src/entities/character.entity';
import { CharacterService } from '../characters/characters.service';
import { logger } from 'src/utils/logger.service';

@Injectable()
export class BattleService {
  constructor(
    @InjectRepository(Battle)
    private readonly battleRepository: Repository<Battle>,

    @InjectRepository(BattleLog)
    private readonly battleLogRepository: Repository<BattleLog>,

    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,

    private readonly characterService: CharacterService,
  ) {}

  async findOpponentAndStartBattle(playerId: string) {
    const player = await this.characterRepository.findOne({ where: { id: playerId } });
    logger.log('findOpponentAndStartBattle', playerId);

    if (!player) {
      logger.error('Player not found');
      return { status: 'error', message: 'Player not found' };
    }

    const minGearScore = player.gearScore - 80;
    const maxGearScore = player.gearScore + 80;

    const opponents = await this.characterRepository.find({
      where: {
        gearScore: Between(minGearScore, maxGearScore),
        id: Not(playerId),
      },
    });

    if (opponents.length === 0) {
      return { status: 'searching' }; 
    }

    const randomOpponent = opponents[Math.floor(Math.random() * opponents.length)];

    const battle = this.battleRepository.create({
      playerOne: player,
      playerTwo: randomOpponent,
      playerOneHp: player.hp,
      playerTwoHp: randomOpponent.hp,
    });

    await this.battleRepository.save(battle);

    return { status: 'found', battleId: battle.id };
  }

  async getBattleStatus(battleId: string) {
    const battle = await this.battleRepository.findOne({
      where: { id: battleId },
      relations: ['playerOne', 'playerTwo'],
    });

    if (!battle) {
      logger.error('Battle not found');
      return { status: 'error', message: 'Battle not found' };
    }

    let winnerName = null;

    if (battle.winnerId) {
      // Fetch the winner's character details to get the winner's name
      const winner = await this.characterRepository.findOne({ where: { id: battle.winnerId } });
      winnerName = winner ? winner.user.username : null; // Adjust this line if winner's name is stored differently
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
    const battle = await this.battleRepository.findOne({
      where: { id: battleId },
      relations: ['playerOne', 'playerTwo'],
    });

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
    return await this.battleRepository.save(battle);
  }

	private async finishBattle(battle: Battle, winner: Character) {
    const loser = winner.id === battle.playerOne.id ? battle.playerTwo : battle.playerOne;
    battle.winnerId = winner.id;
    battle.winnerName = winner.user.username; // Set the winner's name

    // Add experience for both players
    await this.characterService.addExperience(winner.id, 100); // Winner
    await this.characterService.addExperience(loser.id, 50); // Loser

    logger.log('Battle finished', battle);

    return await this.battleRepository.save(battle);
  }
}