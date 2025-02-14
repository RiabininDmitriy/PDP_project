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

  // Method to find a Character by its ID using CharactersRepository
  async findCharacterById(characterId: string): Promise<Character | null> {
    console.log(characterId);
    // Calls the findCharacterById method from the CharactersRepository to retrieve the Character
    return this.characterRepository.findCharacterById(characterId);
  }

  // Method to find potential opponents for the given character based on gearScore
  async findOpponents(characterId: string, gearScore: number): Promise<Character[]> {
    // Calls findOpponents method from the CharactersRepository to get characters with a similar gearScore
    return this.characterRepository.findOpponents(characterId, gearScore);
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
}