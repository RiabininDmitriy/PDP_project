import { Controller, Post, Body, Get, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { CharacterService } from './characters.service';
import { CHARACTER_CLASSES } from './config/character-classes.config';
import { CreateCharacterDto, FindOpponentResponseDto, GetOpponentDto } from './dto/characters.dto';
import { AuthGuard } from '@nestjs/passport';
import { PersonalGuard } from 'src/utils/auth/guards/personal_guard';
import { logger, WinstonLoggerService } from 'src/utils/logger.service';
import { FINDING_OPPONENT, GETTING_CHARACTER, GETTING_CHARACTER_CLASSES } from './constants';

@Controller('characters')
export class CharacterController {
  constructor(private readonly characterService: CharacterService, private readonly logger: WinstonLoggerService) {
    this.logger.setContext('CharacterController');
  }

  @UseGuards(AuthGuard('jwt'), PersonalGuard)
  @Post(':userId')
  async createCharacter(
    @Param('userId') userId: string,
    @Body() createCharacterDto: CreateCharacterDto,
  ) {
    return this.characterService.createCharacter(userId, createCharacterDto.classType);
  }

  @UseGuards(AuthGuard('jwt'), PersonalGuard)
  @Get('/classes')
  getCharacterClasses() {
    this.logger.log(GETTING_CHARACTER_CLASSES);
    return Object.keys(CHARACTER_CLASSES).map((classType) => ({
      classType,
      attributes: CHARACTER_CLASSES[classType],
    }));
  }

  @UseGuards(AuthGuard('jwt'), PersonalGuard)
  @Get(':userId')
  async getCharacter(@Param('userId') userId: string) {
    this.logger.log(`${GETTING_CHARACTER} ${userId}`);
    return this.characterService.getCharacter(userId);
  }

  @UseGuards(AuthGuard('jwt'), PersonalGuard)
  @Get(':characterId/users/:userId/opponent')
  async getOpponent(@Param('characterId') characterId: string, @Param('userId') userId: string): Promise<FindOpponentResponseDto> {
    this.logger.log(`${FINDING_OPPONENT} ${characterId}`);    
    return this.characterService.getOpponent(characterId);
  }
}
