import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { WinstonLoggerService } from 'src/utils/logger.service';
import { PersonalGuard } from 'src/utils/auth/guards/personal_guard';
import { NonPersonalGuard } from 'src/utils/auth/guards/non_personal_guard';
import { UserDto } from './dto/user.dto';
import { GETTING_ALL_USERS, GETTING_USER_BY_ID  } from './constants';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly logger: WinstonLoggerService,
  ) {
    this.logger.setContext('UserController');
  }

  @UseGuards(AuthGuard('jwt'), NonPersonalGuard)
  @Get()
  async getUsers(@Request() req): Promise<UserDto[]> {
    this.logger.log(`${GETTING_ALL_USERS} ${req.user}`);
    const users = await this.userService.getUsers();
    return users.map(user => new UserDto(user));
  }

  @UseGuards(AuthGuard('jwt'), PersonalGuard)
  @Get('/:id')
  async getUser(@Param('id') id: string, @Request() req): Promise<UserDto> {
    this.logger.log(`${GETTING_USER_BY_ID} ${req.user}`);
    const user = await this.userService.getUserById(id);
    return new UserDto(user);
  }
}
