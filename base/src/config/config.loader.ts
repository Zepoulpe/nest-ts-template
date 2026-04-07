import { config } from 'dotenv';
import { appConfigSchema } from './config.schema';

/**
 * Load .env + .env.{env} + validate using Zod
 */
export function loadConfig() {
  const env = process.env.NODE_ENV ?? 'local';

  config();

  if (env === 'local') {
    config({ path: `.env` });
  }

  const parsed = appConfigSchema.safeParse({
    NODE_ENV: env,

    server: {
      port: process.env.PORT,
      host: process.env.HOST,
    },

    cors: {
      enabled: process.env.CORS_ENABLED,
      allowedOrigins: process.env.CORS_ALLOWED_ORIGINS?.split(',') ?? [],
    },

    logger: {
      level: process.env.LOGGER_LEVEL?.split(',') ?? undefined,
      json: process.env.LOGGER_JSON,
    },

    swagger: {
      enabled: process.env.SWAGGER_ENABLED,
      title: process.env.SWAGGER_TITLE,
      description: process.env.SWAGGER_DESCRIPTION,
      version: process.env.SWAGGER_VERSION,
    },

    // @nest-template:loader-mapping
  });

  if (!parsed.success) {
    console.error('❌ Invalid configuration:');
    console.error(parsed.error!.issues);
    process.exit(1);
  }

  return parsed.data;
}
