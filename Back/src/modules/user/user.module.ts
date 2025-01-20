import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repo';
import { User } from 'src/entities/user.entity';
import { UserService } from './user.service';
import { WinstonLoggerService } from 'src/utils/logger.service';
import { Character } from 'src/entities/character.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Character]),],
  providers: [UserService, UserRepository, WinstonLoggerService],
  exports: [UserService],
})
export class UserModule {}
