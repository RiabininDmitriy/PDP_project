import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { AccessTokenDto } from './dto/acces_token.dto';
import { LoginUserDto } from './dto/login_user_dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  async register(@Body() body: { username: string; password: string }) {
    const { username, password } = body;
    const existingUser = await this.userService.findByUsername(username);

    if (existingUser) {
      throw new UnauthorizedException('Username already exists');
    }

    const user = await this.userService.createUser(username, password);
    return { message: 'User registered successfully', user };
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<AccessTokenDto> {
    return this.authService.loginUser(loginUserDto.username, loginUserDto.password);
  }
}
