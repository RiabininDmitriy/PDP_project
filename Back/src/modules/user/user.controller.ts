import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../entities/user.entity';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getUsers(@Request() req): Promise<User[]> {
    console.log('Authenticated user:', req.user);
    return this.userService.getUsers();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:id')
  async getUser(@Param('id') id: string, @Request() req): Promise<User> {
    console.log('Authenticated user:', req.user);
    return this.userService.getUserById(+id);
  }
}
