import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class PersonalGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const user = request.user;
		const userId = request.params.userId;
		
		if (!user || !userId) {
			throw new ForbiddenException('Access denied');
		}
	
		if (user.userId !== userId) {
			throw new ForbiddenException('You can only access your own data');
		}
	
		return true;
	}
}