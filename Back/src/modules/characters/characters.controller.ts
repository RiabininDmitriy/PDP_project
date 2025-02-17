import { Controller, Post, Body, Get, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { CharacterService } from './characters.service';
import { CHARACTER_CLASSES } from './config/character-classes.config';
import { CreateCharacterDto, FindOpponentResponseDto, GetOpponentDto } from './dto/characters.dto';
import { AuthGuard } from '@nestjs/passport';
import { PersonalGuard } from 'src/utils/auth/guards/personal_guard';
import { NonPersonalGuard } from 'src/utils/auth/guards/non_personal_guard';
import { logger } from 'src/utils/logger.service';

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
  async getCharacter(@Param('userId', ParseIntPipe) userId: number) {
    return this.characterService.getCharacter(userId);
  }

  @UseGuards(AuthGuard('jwt'), PersonalGuard)
  @Get(':characterId/users/:userId/opponent')
  async getOpponent(@Param('characterId') characterId: string, @Param('userId') userId: string): Promise<FindOpponentResponseDto> {
    logger.log('findOpponent', characterId);

    return this.characterService.getOpponent(characterId);
  }
}
