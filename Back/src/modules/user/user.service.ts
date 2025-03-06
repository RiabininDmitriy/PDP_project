import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repo';
import { User } from 'src/entities/user.entity';
import { WinstonLoggerService } from 'src/utils/logger.service';
import { CREATING_USER, FINDING_USER_BY_USERNAME, GETTING_ALL_USERS } from './constants';
import { GETTING_USER_BY_ID } from './constants';
import { GETTING_USER_BY_LOGIN_AND_PASSWORD } from './constants';
import { GETTING_USER_BY_USERNAME } from './constants';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly logger: WinstonLoggerService,
  ) {
    this.logger.setContext('UserService');
  }

  async findByUsername(username: string) {
    this.logger.log(`${FINDING_USER_BY_USERNAME} ${username}`);
    return this.userRepository.findByUsername(username);
  }

  async createUser(username: string, password: string): Promise<User> {
    this.logger.log(`${CREATING_USER} ${username}`);
    const user = this.userRepository.create({
      username,
      password,
    });
    return this.userRepository.save(user);
  }

  async getUsers() {
    this.logger.log(`${GETTING_ALL_USERS}`);
    return this.userRepository.getUsers();
  }

  async getUserById(id: string) {
    this.logger.log(`${GETTING_USER_BY_ID} ${id}`);
    return this.userRepository.getUserById(id);
  }

  async getUserByLoginAndPassword(username: string, hashedPassword: string) {
    this.logger.log(`${GETTING_USER_BY_LOGIN_AND_PASSWORD} ${username}`);
    return this.userRepository.getUserByLoginAndPassword(username, hashedPassword);
  }

  async getUserByUsername(username: string) {
    this.logger.log(`${GETTING_USER_BY_USERNAME} ${username}`);
    return this.userRepository.getUserByUsername(username);
  }
}
