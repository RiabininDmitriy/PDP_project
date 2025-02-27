import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Battle } from 'src/entities/battle.entity';
import { Character } from 'src/entities/character.entity';

@Injectable()
export class BattleRepository extends Repository<Battle> {
  constructor(
    @InjectRepository(Battle)
    private readonly battleRepository: Repository<Battle>,
    
  ) {
    super(battleRepository.target, battleRepository.manager, battleRepository.queryRunner);
  }

  async createBattle(playerOne: Character, playerTwo: Character): Promise<Battle> {
    // Create a new Battle entity using the provided players and their starting health points
    const battle = this.battleRepository.create({
      playerOne,
      playerTwo,
      playerOneHp: playerOne.hp,
      playerTwoHp: playerTwo.hp,
    });

    return this.battleRepository.save(battle);
  }

  async getBattleById(battleId: string): Promise<Battle | null> {
    // Fetch the battle using the provided battleId, and include the related player entities
    return this.battleRepository.findOne({
      where: { id: battleId },
      relations: ['playerOne', 'playerTwo'],
    });
  }

  async saveBattle(battle: Battle): Promise<Battle> {
    return this.battleRepository.save(battle);
  }

  async findBattleWithLogs(battleId: string): Promise<Battle | undefined> {
    return this.findOne({
        where: { id: battleId },
        relations: ['logs', 'playerOne', 'playerTwo']
    });
  }
}