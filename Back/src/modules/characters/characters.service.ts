import { Injectable } from '@nestjs/common';
import { Character } from 'src/entities/character.entity';
import { UserRepository } from '../user/user.repo';
import { CHARACTER_CLASSES } from './config/character-classes.config';
import { logger } from 'src/utils/logger.service';
import { CharacterClass } from '../../entities/utils/characters.types';
import { calculateGearScore } from 'src/utils/utils';
import { CharactersRepository } from './characters.repo';
import { EntityManager } from 'typeorm';

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

  // async addExperience(characterId: string, xpGained: number) {
  //   // Adds experience to a character and handles leveling up if the XP threshold is reached
  //   const character = await this.charactersRepository.findCharacterById(characterId);
  
  //   if (!character) {
  //     throw new Error('Character not found'); // Error handling if character is not found
  //   }
  
  //   character.xp += xpGained; // Add gained XP to character's total
  
  //   while (character.xp >= this.getXpThreshold(character.level)) {
  //     character.xp -= this.getXpThreshold(character.level); // Subtract the threshold to calculate remaining XP
  //     character.level++; // Increment character's level
  //     this.levelUpCharacter(character); // Level up the character
  //   }
  
  //   return await this.charactersRepository.saveCharacter(character);// Save the updated character data
  // }

  async addExperience(characterId: string, xpGained: number, manager: EntityManager) {
    const character = await manager.findOne(Character, { where: { id: characterId } });
  
    if (!character) {
      throw new Error('Character not found');
    }

    character.xp += xpGained;

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
}