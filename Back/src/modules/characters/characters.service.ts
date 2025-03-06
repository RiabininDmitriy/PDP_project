import { Injectable } from '@nestjs/common';
import { Character } from 'src/entities/character.entity';
import { UserRepository } from '../user/user.repo';
import { CHARACTER_CLASSES } from './config/character-classes.config';
import { logger, WinstonLoggerService } from 'src/utils/logger.service';
import { CharacterClass } from '../../entities/utils/characters.types';
import { calculateGearScore } from 'src/utils/utils';
import { CharactersRepository } from './characters.repo';
import { EntityManager } from 'typeorm';
import { FindOpponentResponseDto } from './dto/characters.dto';
import { FOUND_STATUS, GEAR_SCORE_RANGE, SEARCHING_STATUS, FINDING_OPPONENT_AND_START_BATTLE, PLAYER_NOT_FOUND, INVALID_CLASS_TYPE, CHARACTER_NOT_FOUND } from './constants';

@Injectable()
export class CharacterService {
  constructor(
    private readonly charactersRepository: CharactersRepository,
    private readonly userRepository: UserRepository,
    private readonly logger: WinstonLoggerService,
  ) {
    this.logger.setContext('CharacterService');
  }

  async createCharacter(userId: string, classType: CharacterClass):Promise<Character[]> {
    const user = await this.userRepository.getUserById(userId);

    if (!user) {
      this.logger.error(PLAYER_NOT_FOUND, userId);
      throw new Error('User not found');
    }

    const characterAttributes = CHARACTER_CLASSES[classType];
    if (!characterAttributes) {
      this.logger.error(INVALID_CLASS_TYPE, classType);
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

  async getCharacter(userId: string): Promise<Character> {
    return this.charactersRepository.findCharacterByUserId(userId);
  }

  private getXpThreshold(level: number): number {
    return Math.floor(100 * Math.pow(1.2, level - 1));
  }

  private levelUpCharacter(character: Character, levelsGained: number) {
    for (let i = 0; i < levelsGained; i++) {
      character.hp += 10;
      character.normalAttack += 2;
      character.heavyAttack += 3;
      character.defense += 1;
      character.gearScore = Math.round(calculateGearScore(character));
      character.money += 10;
    }
  }

  async addExperience(characterId: string, xpGained: number, manager: EntityManager) {
    const character = await manager.findOne(Character, { where: { id: characterId } });
  
    if (!character) {
      this.logger.error(CHARACTER_NOT_FOUND, characterId);
      throw new Error(CHARACTER_NOT_FOUND);
    }
  
    character.xp += xpGained;
  
    let levelsGained = 0;
    while (character.xp >= this.getXpThreshold(character.level)) {
      character.xp -= this.getXpThreshold(character.level);
      character.level++;
      levelsGained++;
    }
  
    const transactionResult = await manager.transaction(async transactionManager => {
      if (levelsGained > 0) {
        this.levelUpCharacter(character, levelsGained);
      }
      await transactionManager.save(Character, character);
    });
  
    return transactionResult;
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
    this.logger.log(`${FINDING_OPPONENT_AND_START_BATTLE} ${characterId}`);

    if (!player) {
      this.logger.error(PLAYER_NOT_FOUND, characterId);
      throw new Error(PLAYER_NOT_FOUND);
    }

    const minGearScore = player.gearScore - GEAR_SCORE_RANGE;
    const maxGearScore = player.gearScore + GEAR_SCORE_RANGE;

    const opponents = await this.charactersRepository.findOpponents(characterId, minGearScore, maxGearScore);

    if (opponents.length === 0) {
      return { status: SEARCHING_STATUS };
    }
    const randomOpponent = opponents[Math.floor(Math.random() * opponents.length)];

    return { status: FOUND_STATUS, opponent: randomOpponent };
  }

  async getWinnerName(winnerId: string): Promise<string | null>  {
    const winner = await this.charactersRepository.findCharacterById(winnerId);
    return winner ? winner.user.username : null;
  }
}
