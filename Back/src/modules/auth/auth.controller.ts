import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { AccessTokenDto, LoginUserDto, RegisterUserDto } from './dto/auth.dto';
import { WinstonLoggerService } from 'src/utils/logger.service';
import { CharacterService } from '../characters/characters.service';
import { LOGIN_REQUEST_RECEIVED, USER_ALREADY_EXISTS, USER_REGISTERED_SUCCESSFULLY } from './constants';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly logger: WinstonLoggerService,
    private readonly characterService: CharacterService,
  ) { 
    this.logger.setContext('AuthController');
  }

  @Post('register')
  async register(@Body() loginUserDto: LoginUserDto): Promise<RegisterUserDto> {
    const { username, password } = loginUserDto;
    const existingUser = await this.userService.findByUsername(username);

    if (existingUser) {
      this.logger.error(USER_ALREADY_EXISTS, username);
      throw new UnauthorizedException(USER_ALREADY_EXISTS);
    }

    const user = await this.authService.registerUser(loginUserDto);
    this.logger.log(`${USER_REGISTERED_SUCCESSFULLY} ${user.username}`);
    return { message: USER_REGISTERED_SUCCESSFULLY, username: user.username, user };
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<AccessTokenDto> {
    this.logger.log(`${LOGIN_REQUEST_RECEIVED} ${loginUserDto.username}`);
    const accessTokenDto = await this.authService.login(loginUserDto);
    const character = await this.characterService.getCharacter(accessTokenDto.userId);

    return {
      access_token: accessTokenDto.access_token,
      userId: accessTokenDto.userId,
      characterId: character?.id || null,
    };
  }
}
