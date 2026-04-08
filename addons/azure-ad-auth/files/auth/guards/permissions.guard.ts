import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SCOPES_KEY } from '../decorators/scopes.decorator';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public-route.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const requiredScopes = this.reflector.getAllAndOverride<string[]>(SCOPES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (!user) throw new ForbiddenException('No user found in request');

    if (requiredScopes?.length) {
      const hasScope = requiredScopes.some((s) => user.scopes.includes(s));
      if (!hasScope) {
        throw new ForbiddenException('Missing required scope');
      }
    }

    if (requiredRoles?.length) {
      const hasRole = requiredRoles.some((r) => user.roles.includes(r));
      if (!hasRole) {
        throw new ForbiddenException('Missing required app role');
      }
    }

    return true;
  }
}
