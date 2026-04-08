import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { setupSwagger } from '@common/swagger/swagger.setup';
import { AppConfigService } from '@config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const logger = app.get(Logger);

  app.useLogger(logger);

  const configService = app.get(AppConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  const cors = configService.get('cors');
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || cors.allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS error: origin ${origin} not allowed`));
    },
    credentials: true,
    exposedHeaders: ['Content-Disposition'],
  });

  const swagger = configService.get('swagger');
  if (swagger.enabled) {
    setupSwagger(app, logger);
  }

  app.enableShutdownHooks();

  const server = configService.get('server');
  await app.listen(server.port, '0.0.0.0');

  logger.log(`API running on port ${server.port}`);
}
bootstrap();
