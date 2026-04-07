import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfigService } from '@config/config.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) => {
        const mongo = configService.get('mongo');
        return {
          uri: mongo.uri,
          dbName: mongo.dbName,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
