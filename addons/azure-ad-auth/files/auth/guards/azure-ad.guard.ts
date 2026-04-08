import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public-route.decorator';

@Injectable()
export class AzureADGuard extends AuthGuard('azure-jwt') {
  private readonly logger = new Logger(AzureADGuard.name);

  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    try {
      const result = await super.canActivate(context);
      return !!result;
    } catch (err) {
      this.logger.error('JWT validation failed:', err?.message);
      return false;
    }
  }
}
