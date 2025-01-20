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
  async register(@Body() loginUserDto: LoginUserDto) {
    const { username, password } = loginUserDto;
    const existingUser = await this.userService.findByUsername(username);

    if (existingUser) {
      this.logger.error('Username already exists', username);
      throw new UnauthorizedException('Username already exists');
    }

    const user = await this.authService.registerUser(loginUserDto);
    this.logger.log('User registered successfully', { username: user.username });
    return { message: 'User registered successfully', user };
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<AccessTokenDto> {
    this.logger.log('Login request received', { username: loginUserDto.username });
    const accessTokenDto = await this.authService.login(loginUserDto);

    return {
      access_token: accessTokenDto.access_token,
      userId: accessTokenDto.userId,
    };
  }
}
