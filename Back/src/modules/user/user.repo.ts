import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(
    @InjectRepository(User)
    repository: Repository<User>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.findOne({ where: { username } });
  }

  async getUsers(): Promise<User[]> {
    return this.find();
  }

  async getUserById(id: string): Promise<User> {
    return this.findOneBy({ id });
  }

  async getUserByLoginAndPassword(username: string, password: string): Promise<User> {
    return this.findOne({ where: { username, password } });
  }

  async getUserByUsername(username: string): Promise<User> {
    return this.findOne({ where: { username } });
  }
}
