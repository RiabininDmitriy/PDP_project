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

  async createCharacter(characterData: any): Promise<Character[]> {
    const character = this.characterRepository.create(characterData);
    return this.characterRepository.save(character);
  }

  async findCharacterById(characterId: string): Promise<Character | null> {
    return this.characterRepository.findOne({ where: { id: characterId } });
  }

  async findCharacterByUserId(userId: number): Promise<Character | null> {
    return this.characterRepository.findOne({
      where: { user: { id: userId } },
    });
  }

  async saveCharacter(character: Character): Promise<Character> {
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
