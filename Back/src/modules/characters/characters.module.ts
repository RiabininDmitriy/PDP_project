import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Character } from 'src/entities/character.entity';
import { User } from 'src/entities/user.entity';
import { CharacterController } from './characters.controller';
import { CharacterService } from './characters.service';
import { UserRepository } from '../user/user.repo';


@Module({
  imports: [TypeOrmModule.forFeature([Character, User])],
  controllers: [CharacterController],
  providers: [CharacterService, UserRepository],
  exports: [CharacterService]
})
export class CharacterModule {}
