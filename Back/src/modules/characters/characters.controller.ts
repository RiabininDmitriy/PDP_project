import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CharacterService } from './characters.service';
import { CharacterClass } from './characters.types';
import { CHARACTER_CLASSES } from './config/character-classes.config';

@Controller('characters')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Post(':userId')
  async createCharacter(
    @Param('userId') userId: number,
    @Body('classType') classType: CharacterClass,
  ) {
    return this.characterService.createCharacter(userId, classType);
  }

  @Get('/classes')
  getCharacterClasses() {
    return Object.keys(CHARACTER_CLASSES).map((classType) => ({
      classType,
      attributes: CHARACTER_CLASSES[classType],
    }));
  }

  @Get(':userId')
  async getCharacter(@Param('userId') userId: number) {
    return this.characterService.getCharacter(userId);
  }
}