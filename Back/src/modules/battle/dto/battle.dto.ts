import { IsString, IsUUID, IsOptional } from 'class-validator';
import { BattleLog } from 'src/entities/battle-log.entity';
import { Battle } from 'src/entities/battle.entity';

export class FindOpponentDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  characterId: string;
}
export class BattleStatusDto {
  @IsUUID()
  battleId: string;

  @IsUUID()
  userId: string;
}
export class ProcessRoundDto {
  @IsUUID()
  battleId: string;

  @IsUUID()
  userId: string;
}

export class FindOpponentResponseDto {
  @IsString()
  status: string;

  @IsOptional()
  battleId?: string;

  @IsOptional()
  message?: string;
}

export enum BattleStatus {
  InProgress = 'in_progress',
  Finished = 'finished',
  Error = 'error'
}

export class BattleStatusResponseDto {
  @IsString()
  status: string;

  @IsOptional()
  message?: string;

  @IsOptional()
  winnerId?: string;

  @IsOptional()
  winnerName?: string;

  @IsOptional()
  battle?: Battle;

  @IsOptional()
  battleLog?: BattleLog;

  @IsOptional()
  currentRound?: number;

  @IsOptional()
  isFinished?: boolean;

  @IsOptional()
  isError?: boolean;

  @IsOptional()
  isInProgress?: boolean;

  @IsOptional()
  roundLog?: BattleLog;

  @IsOptional()
  winner?: {
    id: string;
    name: string;
    experienceGained: number;
    currentLevel: number;
  };

  @IsOptional()
  loser?: {
    id: string;
    name: string;
    experienceGained: number;
    currentLevel: number;
  };
}

export class BattleDto {
  id: string;
  battleCreatorId: string;
  playerOneId: string;
  playerOneHp: number;
  playerTwoId: string;
  playerTwoHp: number;
  winnerId?: string;
  winnerName?: string;

  constructor(battle: Battle) {
      this.id = battle.id;
      this.battleCreatorId = battle.battleCreatorId;
      this.playerOneId = battle.playerOne.id;
      this.playerOneHp = battle.playerOneHp;
      this.playerTwoId = battle.playerTwo.id;
      this.playerTwoHp = battle.playerTwoHp;
      this.winnerId = battle.winnerId;
      this.winnerName = battle.winnerName;
  }
}