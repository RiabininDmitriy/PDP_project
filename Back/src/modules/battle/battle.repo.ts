import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Battle } from 'src/entities/battle.entity';
import { Character } from 'src/entities/character.entity';
import { CharactersRepository } from '../characters/characters.repo';

@Injectable()
export class BattleRepository extends Repository<Battle> {
  constructor(
    @InjectRepository(Battle)
		private readonly battleRepository: Repository<Battle>,
    private readonly characterRepository: CharactersRepository
  ) {
		super(battleRepository.target, battleRepository.manager, battleRepository.queryRunner);
	}

  async findCharacterById(characterId: string): Promise<Character | null> {
		console.log(characterId);
    return this.characterRepository.findCharacterById(characterId);
  }

  async findOpponents(characterId: string, gearScore: number): Promise<Character[]> {
    return this.characterRepository.findOpponents(characterId, gearScore);
  }

  async createBattle(playerOne: Character, playerTwo: Character): Promise<Battle> {
    const battle = this.battleRepository.create({
      playerOne,
      playerTwo,
      playerOneHp: playerOne.hp,
      playerTwoHp: playerTwo.hp,
    });

    return this.battleRepository.save(battle);
  }

  async getBattleById(battleId: string): Promise<Battle | null> {
    return this.battleRepository.findOne({
      where: { id: battleId },
      relations: ['playerOne', 'playerTwo'],
    });
  }

  async saveBattle(battle: Battle): Promise<Battle> {
    return this.battleRepository.save(battle);
  }
}
