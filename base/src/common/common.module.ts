import { Module } from '@nestjs/common';
import { LoggerModule } from '@common/logger/logger.module';

@Module({
  imports: [LoggerModule],
  providers: [],
  exports: [],
})
export class CommonModule {}
