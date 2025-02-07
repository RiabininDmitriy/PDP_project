import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Character } from 'src/entities/character.entity';

@Injectable()
export class CharactersRepository extends Repository<Character> {
  constructor(
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>
  ) {
    super(characterRepository.target, characterRepository.manager, characterRepository.queryRunner);
  }

  // find why array
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
}