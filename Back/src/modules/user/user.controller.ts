import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../entities/user.entity';
import { UserService } from './user.service';
import { WinstonLoggerService } from 'src/utils/logger.service';
import { PersonalGuard } from 'src/utils/auth/guards/personal_guard';
import { NonPersonalGuard } from 'src/utils/auth/guards/non_personal_guard';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly logger: WinstonLoggerService,
  ) {}

  @UseGuards(AuthGuard('jwt'), NonPersonalGuard)
  @Get()
  async getUsers(@Request() req): Promise<User[]> {
    this.logger.log('Authenticated user:', { user: req.user });
    return this.userService.getUsers();
  }

  @UseGuards(AuthGuard('jwt'), PersonalGuard)
  @Get('/:id')
  async getUser(@Param('id') id: string, @Request() req): Promise<User> {
    this.logger.log('Authenticated user:', { user: req.user });
    return this.userService.getUserById(id);
  }
}
