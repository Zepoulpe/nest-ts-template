import type { INestApplication } from '@nestjs/common';
import type { OpenAPIObject } from '@nestjs/swagger';
import type { Logger } from 'nestjs-pino';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppConfigService } from '@config/config.service';
import fs from 'fs';

export function setupSwagger(app: INestApplication, logger: Logger) {
  const configService = app.get(AppConfigService);
  const swagger = configService.get('swagger');

  const swaggerOptions = new DocumentBuilder()
    .setTitle(swagger.title)
    .setDescription(swagger.description)
    .setVersion(swagger.version)
    .build();

  const document: OpenAPIObject = SwaggerModule.createDocument(app, swaggerOptions);

  fs.mkdirSync('./openapi', { recursive: true });
  fs.writeFileSync('./openapi/swagger-spec-app.json', JSON.stringify(document, null, 2));

  SwaggerModule.setup('docs', app, document);

  logger.log('Swagger available at /docs');
}
