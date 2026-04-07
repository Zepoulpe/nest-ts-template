import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { setupSwagger } from '@common/swagger/swagger.setup';

declare const module: {
  hot?: {
    accept: () => void;
    dispose: (cb: () => void) => void;
  };
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const logger = app.get(Logger);

  app.useLogger(logger);

  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  const allowedOrigins = configService.get<string[]>('cors.allowedOrigins') ?? [];
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS error: origin ${origin} not allowed`));
    },
    credentials: true,
    exposedHeaders: ['Content-Disposition'],
  });

  const swaggerEnabled = configService.get<boolean>('swagger.enabled');
  if (swaggerEnabled) {
    setupSwagger(app, logger);
  }

  app.enableShutdownHooks();

  const port = configService.get<number>('server.port') ?? 3000;

  await app.listen(port, '0.0.0.0');

  logger.log(`Notifier API running on port ${port}`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
