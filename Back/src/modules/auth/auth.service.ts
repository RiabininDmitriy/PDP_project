/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user.entity';
import { AccessTokenDto } from './dto/access_token.dto';
import { WinstonLoggerService } from 'src/utils/logger.service';
import { SALT_ROUNDS } from 'src/utils/constants';
import { LoginUserDto } from './dto/login_user_dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly logger: WinstonLoggerService,
  ) { }

  // Register a new user with an encrypted password and save to DB
  async registerUser(loginUserDto: LoginUserDto): Promise<User> {
    const { username, password } = loginUserDto;
    const encryptedPassword = await this.encryptPassword(password);

    this.logger.log('Registering user', { username });
    return this.userService.createUser(username, encryptedPassword);
  }

  // Login a user by validating credentials and returning an access token
  async login(loginUserDto: LoginUserDto): Promise<AccessTokenDto> {
    const { username, password } = loginUserDto;
    const user = await this.authenticateUser(loginUserDto);
    this.logger.log('User authenticated', { username });
    return this.generateAccessToken(user);
  }

  // Encrypt the password before saving it to the database
  private async encryptPassword(password: string): Promise<string> {
    this.logger.log('Encrypting password', { password });
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  // Validate the user's credentials (compare password) and return the user if valid
  private async authenticateUser(loginUserDto: LoginUserDto): Promise<User> {
    const { username, password } = loginUserDto;
    this.logger.log('Authenticating user', { username });
    const user = await this.userService.getUserByUsername(username);

    if (!user) {
      this.logger.error('Invalid credentials', username);
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.isPasswordValid(password, user.password);
    if (!isPasswordValid) {
      this.logger.error('Invalid password', username);
      throw new UnauthorizedException('Invalid password');
    }
    this.logger.log('User authenticated', { username });

    return user;
  }

  // Check if the provided password matches the hashed password stored in DB
  private async isPasswordValid(providedPassword: string, storedPassword: string): Promise<boolean> {
    this.logger.log('Checking password', { providedPassword, storedPassword });
    return bcrypt.compare(providedPassword, storedPassword);
  }

  // Generate an access token for the logged-in user
  private async generateAccessToken(user: User): Promise<AccessTokenDto> {
    this.logger.log('Generating access token', { userId: user.id });
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
