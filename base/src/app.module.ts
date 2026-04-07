import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from '@config/config.module';
import { CommonModule } from '@common/common.module';
import { HealthModule } from './health/health.module';
// @nest-template:imports

@Module({
  imports: [
    AppConfigModule,
    CommonModule,
    HealthModule,
    // @nest-template:modules
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
