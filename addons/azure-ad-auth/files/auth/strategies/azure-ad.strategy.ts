import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';
import { AppConfigService } from '@config/config.service';

@Injectable()
export class AzureADJwtStrategy extends PassportStrategy(Strategy, 'azure-jwt') {
  private readonly logger = new Logger(AzureADJwtStrategy.name);

  constructor(configService: AppConfigService) {
    const azure = configService.get('azure');

    super({
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksUri: `https://login.microsoftonline.com/${azure.tenantId}/discovery/v2.0/keys`,
      }),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      issuer: `https://login.microsoftonline.com/${azure.tenantId}/v2.0`,
      audience: azure.audience,
      algorithms: ['RS256'],
    });
  }

  validate(payload: any) {
    const scopes = payload.scp?.split(' ') ?? [];
    const roles = payload.roles ?? [];

    return {
      ...payload,
      scopes,
      roles,
    };
  }
}
