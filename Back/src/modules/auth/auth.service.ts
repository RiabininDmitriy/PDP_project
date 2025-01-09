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

  async createUser(username: string, password: string): Promise<User> {
    const hashedPassword = await this.createPassCrypted(password);
    return this.userService.createUser(username, hashedPassword);
  }

  async loginUser(username: string, password: string): Promise<AccessTokenDto> {
    const user = await this.validateUser(username, password);
    return this.login(user);
  }

  private async validateUser(username: string, password: string): Promise<any> {
    this.logger.log('Validating user', { username });
    //todo try to find user by Btree index
    //Change naming to validateUser
    const hashedPassword = await this.createPassCrypted(password);
    const user = await this.userService.getUserByLoginAndPassword(username, hashedPassword);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  private async createPassCrypted(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  private async validatePassword(password: string, userPassword: string): Promise<boolean> {
    const hashedPassword = bcrypt.hashSync(password, 10);
    return bcrypt.compare(hashedPassword, userPassword);
  }

  private async login(user: User): Promise<AccessTokenDto> {
    this.logger.log('Logging in user', { userId: user.id });
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
