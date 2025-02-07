import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { CharacterService } from './characters.service';
import { CHARACTER_CLASSES } from './config/character-classes.config';
import { CreateCharacterDto, GetCharacterDto } from './dto/characters.dto';
import { AuthGuard } from '@nestjs/passport';
import { PersonalGuard } from 'src/utils/auth/guards/personal_guard';
import { NonPersonalGuard } from 'src/utils/auth/guards/non_personal_guard';

@Controller('characters')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @UseGuards(AuthGuard('jwt'), PersonalGuard)
  @Post(':userId')
  async createCharacter(
    @Param('userId') userId: number,
    @Body() createCharacterDto: CreateCharacterDto,
  ) {
    return this.characterService.createCharacter(userId, createCharacterDto.classType);
  }

  @UseGuards(AuthGuard('jwt'), NonPersonalGuard)
  @Get('/classes')
  getCharacterClasses() {
    return Object.keys(CHARACTER_CLASSES).map((classType) => ({
      classType,
      attributes: CHARACTER_CLASSES[classType],
    }));
  }

  @UseGuards(AuthGuard('jwt'), PersonalGuard)
  @Get(':userId')
  async getCharacter(@Param() getCharacterDto: GetCharacterDto) {
    return this.characterService.getCharacter(getCharacterDto.userId);
  }
}