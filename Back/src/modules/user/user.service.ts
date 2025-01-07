import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repo';
import { User } from 'src/entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findByUsername(username: string) {
    return this.userRepository.findByUsername(username);
  }

  async createUser(username: string, password: string): Promise<User> {
    const user = this.userRepository.create({
      username,
      password,
    });
    return this.userRepository.save(user);
  }

  async getUsers() {
    return this.userRepository.getUsers();
  }

  async getUserById(id: number) {
    return this.userRepository.getUserById(id);
  }

  async getUserByLoginAndPassword(username: string, hashedPassword: string) {
    return this.userRepository.getUserByLoginAndPassword(username, hashedPassword);
  }
}
