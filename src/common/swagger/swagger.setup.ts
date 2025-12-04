import type { INestApplication } from '@nestjs/common';
import type { OpenAPIObject } from '@nestjs/swagger';
import type { Logger } from 'nestjs-pino';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import fs from 'fs';

export function setupSwagger(app: INestApplication, logger: Logger) {
  const swaggerOptions = new DocumentBuilder()
    .setTitle('Notifier API')
    .setDescription('Internal API - Trading Notifier')
    .setVersion('1.0')
    .addTag('notifier')
    .build();

  const document: OpenAPIObject = SwaggerModule.createDocument(app, swaggerOptions);

  fs.mkdirSync('./openapi', { recursive: true });
  fs.writeFileSync('./openapi/swagger-spec-app.json', JSON.stringify(document, null, 2));

  SwaggerModule.setup('docs', app, document);

  logger.log('Swagger available at /docs');
}
