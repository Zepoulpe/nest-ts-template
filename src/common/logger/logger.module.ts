import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule, // <--- important !
    PinoLoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isProd = config.get('NODE_ENV') !== 'local';
        const logLevel = config.get<string>('logger.level') ?? 'debug';

        return {
          pinoHttp: {
            level: logLevel.toString(),
            transport: isProd
              ? undefined
              : {
                  target: 'pino-pretty',
                  options: {
                    colorize: true,
                    translateTime: 'yyyy-mm-dd HH:MM:ss',
                    singleLine: true,
                  },
                },
          },
        };
      },
    }),
  ],
})
export class LoggerModule {}
