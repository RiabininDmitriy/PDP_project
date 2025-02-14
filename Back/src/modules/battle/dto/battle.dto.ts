import { IsString, IsUUID, IsOptional } from 'class-validator';
import { Battle } from 'src/entities/battle.entity';

// DTO for findOpponent route
export class FindOpponentDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  characterId: string;
}

// DTO for battle status route
export class BattleStatusDto {
  @IsUUID()
  battleId: string;

  @IsUUID()
  userId: string;
}

// DTO for battle round route
export class ProcessRoundDto {
  @IsUUID()
  battleId: string;

  @IsUUID()
  userId: string;
}

// Response DTO for battle status
export class BattleStatusResponseDto {
  @IsString()
  status?: string;

  @IsOptional()
  winnerId?: string;

  @IsOptional()
  winnerName?: string;

  @IsOptional()
  battle?: Battle;

  @IsOptional()
  message?: string;

  @IsOptional()
  battleId?: string;
}

export class FindOpponentResponseDto {
  @IsString()
  status: string;

  @IsOptional()
  battleId?: string;

  @IsOptional()
  message?: string;
}
