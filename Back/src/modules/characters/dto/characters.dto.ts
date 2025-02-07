import { IsEnum, IsInt, Min } from 'class-validator';
import { CharacterClass } from '../../../entities/utils/characters.types';

export class CreateCharacterDto {
  @IsInt()
  @Min(1)
  userId: number;

  @IsEnum(CharacterClass)
  classType: CharacterClass;
}

export class GetCharacterDto {
  @IsInt()
  @Min(1)
  userId: number;
}