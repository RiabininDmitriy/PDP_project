/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user.entity';
import { AccessTokenDto, LoginUserDto } from './dto/auth.dto';
import { WinstonLoggerService } from 'src/utils/logger.service';
import { CHECKING_PASSWORD, ENCRYPTING_PASSWORD, GENERATING_ACCESS_TOKEN, INVALID_CREDENTIALS, REGISTERING_USER, SALT_ROUNDS_ERROR, USER_AUTHENTICATED_SUCCESSFULLY } from './constants';
import { INVALID_PASSWORD } from './constants';

@Injectable()
export class AuthService {
  private readonly saltRounds: number;

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly logger: WinstonLoggerService,
  ) { 
    this.logger.setContext('AuthService');
    this.saltRounds = parseInt(process.env.SALT_ROUNDS, 10);
    if (isNaN(this.saltRounds)) {
      throw new Error(SALT_ROUNDS_ERROR);
    }
  }

  async registerUser(loginUserDto: LoginUserDto): Promise<User> {
    const { username, password } = loginUserDto;
    const encryptedPassword = await this.encryptPassword(password);

    this.logger.log(`${REGISTERING_USER}: ${username}`);
    return this.userService.createUser(username, encryptedPassword);
  }

  async login(loginUserDto: LoginUserDto): Promise<AccessTokenDto> {
    const { username, password } = loginUserDto;
    const user = await this.authenticateUser(loginUserDto);
    this.logger.log(`${USER_AUTHENTICATED_SUCCESSFULLY}: ${username}`);
    return this.generateAccessToken(user);
  }

  private async encryptPassword(password: string): Promise<string> {
    this.logger.log(`${ENCRYPTING_PASSWORD}`);
    return bcrypt.hash(password, this.saltRounds);
  }

  private async authenticateUser(loginUserDto: LoginUserDto): Promise<User> {
    const { username, password } = loginUserDto;
    const user = await this.userService.getUserByUsername(username);

    if (!user) {
      this.logger.error(`${username}`, INVALID_CREDENTIALS);
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    }

    const isPasswordValid = await this.isPasswordValid(password, user.password);
    if (!isPasswordValid) {
      this.logger.error(`${username}`, INVALID_PASSWORD);
      throw new UnauthorizedException(INVALID_PASSWORD);
    }
    this.logger.log(`${USER_AUTHENTICATED_SUCCESSFULLY} ${username}`);

    return user;
  }

  private async isPasswordValid(providedPassword: string, storedPassword: string): Promise<boolean> {
    this.logger.log(`${CHECKING_PASSWORD}`);
    return bcrypt.compare(providedPassword, storedPassword);
  }

  private async generateAccessToken(user: User): Promise<AccessTokenDto> {
    this.logger.log(`${GENERATING_ACCESS_TOKEN} ${user.id}`);
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      userId: user.id,
    };
  }
}
