import { IsUUID, IsString } from 'class-validator';

export class FindOpponentDto {
  @IsUUID()
  characterId: string;

  @IsUUID()
  userId: string;
}

export class ProcessRoundDto {
  @IsUUID()
  battleId: string;

  @IsUUID()
  userId: string;
}

export class GetBattleStatusDto {
  @IsUUID()
  battleId: string;

  @IsUUID()
  userId: string;
}

export class StartBattleDto {
  @IsUUID()
  battleId: string;

  @IsUUID()
  userId: string;
}