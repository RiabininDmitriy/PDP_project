import { Injectable } from '@nestjs/common';
import { Character } from 'src/entities/character.entity';
import { UserRepository } from '../user/user.repo';
import { CHARACTER_CLASSES } from './config/character-classes.config';
import { logger } from 'src/utils/logger.service';
import { CharacterClass } from '../../entities/utils/characters.types';
import { calculateGearScore } from 'src/utils/utils';
import { CharactersRepository } from './characters.repo';
import { EntityManager } from 'typeorm';
import { FindOpponentResponseDto } from './dto/characters.dto';

@Injectable()
export class CharacterService {
  constructor(
    private readonly charactersRepository: CharactersRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async createCharacter(userId: number, classType: CharacterClass):Promise<Character[]> {
    const user = await this.userRepository.getUserById(userId);

    if (!user) {
      logger.error('User not found');
      throw new Error('User not found');
    }

    const characterAttributes = CHARACTER_CLASSES[classType];
    if (!characterAttributes) {
      logger.error(`Invalid class type: ${classType}`);
      throw new Error('Invalid class type');
    }

    const gearScore = calculateGearScore(characterAttributes);
    const character = {
      ...characterAttributes,
      classType,
      user,
      gearScore: Math.round(gearScore),
    };

    return this.charactersRepository.createCharacter(character);
  }

  async getCharacter(userId: number): Promise<Character> {
    return this.charactersRepository.findCharacterByUserId(userId);
  }

  private getXpThreshold(level: number): number {
    // Calculates the XP threshold needed for each level, increasing the requirements with each level

    return Math.floor(100 * Math.pow(1.2, level - 1)); // Each level requires more XP
  }

  private levelUpCharacter(character: Character) {
    // Increases character's stats upon leveling up
    character.hp += 10; // Increase health points
    character.normalAttack += 2; // Increase normal attack power
    character.heavyAttack += 3; // Increase heavy attack power
    character.defense += 1; // Increase defense
    character.gearScore = Math.round(calculateGearScore(character)); // Update gear score based on new stats
    character.money += 10;
  }

  async addExperience(characterId: string, xpGained: number, manager: EntityManager) {
    const character = await manager.findOne(Character, { where: { id: characterId } });
  
    if (!character) {
      throw new Error('Character not found');
    }

    character.xp += xpGained;

    //TODO: винести підрахунки до того як виконується транзакція
    while (character.xp >= this.getXpThreshold(character.level)) {
      character.xp -= this.getXpThreshold(character.level);
      character.level++;
      this.levelUpCharacter(character);
    }

    await manager.save(Character, character);
    return character;
  }

  async addExperienceForTwoCharacters(characterId1: string, xpGained1: number, characterId2: string, xpGained2: number) {
    return this.charactersRepository.manager.transaction(async (manager: EntityManager) => {
      const character1 = await this.addExperience(characterId1, xpGained1, manager);
      const character2 = await this.addExperience(characterId2, xpGained2, manager);

      return { character1, character2 };
    });
  }

  async getOpponent(characterId: string): Promise<FindOpponentResponseDto> {
    const player = await this.charactersRepository.findCharacterById(characterId);
    logger.log('findOpponentAndStartBattle', characterId);

    if (!player) {
      logger.error('Player not found');
      return { status: 'error', message: 'Player not found' };
    }

    // Find potential opponents based on gear score
    const opponents = await this.charactersRepository.findOpponents(characterId, player.gearScore);

    // If no opponents are found, return 'searching' status
    if (opponents.length === 0) {
      return { status: 'searching' };
    }

    // Randomly select an opponent
    const randomOpponent = opponents[Math.floor(Math.random() * opponents.length)];

    return { status: 'found', opponent: randomOpponent };
  }

  async getWinnerName(winnerId: string): Promise<string | null>  {
    const winner = await this.charactersRepository.findCharacterById(winnerId);
    return winner ? winner.user.username : null;
  }
}
