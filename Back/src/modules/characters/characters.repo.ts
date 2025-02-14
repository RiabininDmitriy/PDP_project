import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Not, Repository } from 'typeorm';
import { Character } from 'src/entities/character.entity';

@Injectable()
export class CharactersRepository extends Repository<Character> {
  constructor(
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>
  ) {
    super(characterRepository.target, characterRepository.manager, characterRepository.queryRunner);
  }

  //change any to DTO
  async createCharacter(characterData: any): Promise<Character[]> {
    const character = this.characterRepository.create(characterData);
    return this.characterRepository.save(character);
  }

  async findCharacterById(characterId: string) {
    return this.characterRepository.findOne({ where: { id: characterId } });
  }

  async findCharacterByUserId(userId: number) {
    return this.characterRepository.findOne({
      where: { user: { id: userId } },
    });
  }

  async saveCharacter(character: Character) {
    return this.characterRepository.save(character);
  }

  async findOpponents(characterId: string, gearScore: number): Promise<Character[]> {
    return this.characterRepository.find({
      where: {
        gearScore: Between(gearScore - 80, gearScore + 80),
        id: Not(characterId),
      },
    });
  }
}
