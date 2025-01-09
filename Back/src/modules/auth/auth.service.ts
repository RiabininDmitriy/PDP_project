import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user.entity';
import { AccessTokenDto } from './dto/access_token.dto';
import { WinstonLoggerService } from 'src/utlis/logger.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly logger: WinstonLoggerService,
  ) {}

  // Register a new user with an encrypted password and save to DB
  async registerUser(username: string, password: string): Promise<User> {
    const encryptedPassword = await this.encryptPassword(password);

    console.log('encryptedPassword', encryptedPassword);
    return this.userService.createUser(username, encryptedPassword);
  }

  // Login a user by validating credentials and returning an access token
  async login(username: string, password: string): Promise<AccessTokenDto> {
    const user = await this.authenticateUser(username, password);
    return this.generateAccessToken(user);
  }

  // Encrypt the password before saving it to the database
  private async encryptPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  // Validate the user's credentials (compare password) and return the user if valid
  private async authenticateUser(username: string, password: string): Promise<User> {
    this.logger.log('Authenticating user', { username });
    //todo try to find user by Btree index
    // Find the user in the database by username
    const user = await this.userService.getUserByUsername(username);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.isPasswordValid(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  // Check if the provided password matches the hashed password stored in DB
  private async isPasswordValid(providedPassword: string, storedPassword: string): Promise<boolean> {
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
