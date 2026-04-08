import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator, UnauthorizedException } from '@nestjs/common';

export const CurrentUserEmail = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();

    const user = request.user;
    if (!user) {
      throw new UnauthorizedException('User not found in request');
    }

    return user.email || user.preferred_username || user.upn;
  },
);
