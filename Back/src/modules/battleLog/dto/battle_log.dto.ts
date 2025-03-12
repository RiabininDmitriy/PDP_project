export class BattleLogDto {
  id: string;
  battleDate: string;
  outcome: string;
  participantsCount: number;
  logIds?: number[];
  battleId?: string;
}

export function mapToBattleLogDto(rawData: any[]): BattleLogDto[] {
  return rawData.map(data => ({
    battleId: data.battleId,
    logIds: data.logIds,
    battleDate: data.battleDate,
    outcome: data.outcome,
    participantsCount: data.participantsCount,
    id: data.id
  }));
}