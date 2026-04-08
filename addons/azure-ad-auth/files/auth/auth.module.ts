import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AzureADGuard, PermissionsGuard } from './guards';
import { AzureADJwtStrategy } from './strategies/azure-ad.strategy';

@Module({
  providers: [
    AzureADJwtStrategy,
    {
      provide: APP_GUARD,
      useClass: AzureADGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AuthModule {}
