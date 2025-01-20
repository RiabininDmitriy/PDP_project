import { IsEnum, IsInt, Min } from 'class-validator';
import { CharacterClass } from 'src/modules/characters/characters.types';

export class CreateCharacterDto {
  @IsInt()
  @Min(1)
  userId: number;

  @IsEnum(CharacterClass)
  classType: CharacterClass;
}