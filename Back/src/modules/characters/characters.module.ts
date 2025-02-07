import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Character } from 'src/entities/character.entity';
import { User } from 'src/entities/user.entity';
import { CharacterController } from './characters.controller';
import { CharacterService } from './characters.service';
import { UserRepository } from '../user/user.repo';
import { CharactersRepository } from './characters.repo';
import { PersonalGuard } from 'src/utils/auth/guards/personal_guard';
import { NonPersonalGuard } from 'src/utils/auth/guards/non_personal_guard';
import { UserService } from '../user/user.service';
import { WinstonLoggerService } from 'src/utils/logger.service';


@Module({
  imports: [TypeOrmModule.forFeature([Character, User])],
  controllers: [CharacterController],
  providers: [CharacterService, UserRepository, CharactersRepository, UserService, PersonalGuard, NonPersonalGuard, WinstonLoggerService],
  exports: [CharacterService]
})
export class CharacterModule {}
