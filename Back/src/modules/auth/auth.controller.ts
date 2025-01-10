import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { AccessTokenDto } from './dto/access_token.dto';
import { LoginUserDto } from './dto/login_user_dto';
import { WinstonLoggerService } from 'src/utils/logger.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly logger: WinstonLoggerService,
  ) { }

  @Post('register')
  async register(@Body() body: { username: string; password: string }) {
    const { username, password } = body;
    const existingUser = await this.userService.findByUsername(username);

    if (existingUser) {
      this.logger.error('Username already exists', username);
      throw new UnauthorizedException('Username already exists');
    }

    const user = await this.authService.registerUser(username, password);
    this.logger.log('User registered successfully', { username });
    return { message: 'User registered successfully', user };
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<AccessTokenDto> {
    this.logger.log('Login request received', { username: loginUserDto.username });
    return this.authService.login(loginUserDto.username, loginUserDto.password);
  }
}
