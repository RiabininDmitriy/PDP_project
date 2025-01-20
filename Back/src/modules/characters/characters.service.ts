import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Character } from 'src/entities/character.entity';
import { UserRepository } from '../user/user.repo';
import { CHARACTER_CLASSES } from './config/character-classes.config';
import { logger } from 'src/utils/logger.service';
import { CharacterClass } from './characters.types';
import { calculateGearScore } from 'src/utils/utils';

@Injectable()
export class CharacterService {
  constructor(
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,
    private readonly userRepository: UserRepository,
  ) {}

  async createCharacter(userId: number, classType: CharacterClass) {
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
    const character = this.characterRepository.create({
      ...characterAttributes,
      classType,
      user,
      gearScore: Math.round(gearScore),
    });

    return await this.characterRepository.save(character);
  }

  async getCharacter(userId: number) {
    return await this.characterRepository.findOne({
      where: { user: { id: userId } },
    });
  }
}