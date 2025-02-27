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

  //add index on password (if this method needed because of performance issues)
  async getUserByLoginAndPassword(username: string, password: string): Promise<User> {
    return this.findOne({ where: { username, password } });
  }

  async getUserByUsername(username: string): Promise<User> {
    // This method will automatically use the index on `username` if it's properly set in the entity
    return this.findOne({ where: { username } });
  }
}
