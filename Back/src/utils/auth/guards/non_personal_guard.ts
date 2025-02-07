import { Injectable } from "@nestjs/common";
import { CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";

@Injectable()
export class NonPersonalGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Access denied');
    }
    return true; 
  }
}