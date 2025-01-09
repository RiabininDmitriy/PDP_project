import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repo';
import { User } from 'src/entities/user.entity';
import { WinstonLoggerService } from 'src/utlis/logger.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly logger: WinstonLoggerService,
  ) {}

  async findByUsername(username: string) {
    this.logger.log('Finding user by username', { username });
    return this.userRepository.findByUsername(username);
  }

  async createUser(username: string, password: string): Promise<User> {
    this.logger.log('Creating user', { username });
    const user = this.userRepository.create({
      username,
      password,
    });
    return this.userRepository.save(user);
  }

  async getUsers() {
    this.logger.log('Getting all users');
    return this.userRepository.getUsers();
  }

  async getUserById(id: number) {
    this.logger.log('Getting user by id', { id });
    return this.userRepository.getUserById(id);
  }

  async getUserByLoginAndPassword(username: string, hashedPassword: string) {
    this.logger.log('Getting user by login and password', { username });
    return this.userRepository.getUserByLoginAndPassword(username, hashedPassword);
  }
}
