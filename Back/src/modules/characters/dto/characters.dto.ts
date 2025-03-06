import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { CharacterClass } from '../../../entities/utils/characters.types';
import { Character } from 'src/entities/character.entity';

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

export class GetOpponentDto {
  @IsString()
  characterId: string;
}

export class FindOpponentResponseDto {
  @IsString()
  status: string;

  @IsOptional()
  battleId?: string;

  @IsOptional()
  message?: string;

  @IsOptional()
  opponent?: Character;
}
