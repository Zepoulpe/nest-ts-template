import { z } from 'zod';

/* --------------------------------------------- */
/*                 SERVER CONFIG                  */
/* --------------------------------------------- */
export const serverSchema = z.object({
  port: z.coerce.number().default(3000),
  host: z.string().optional(),
});

/* --------------------------------------------- */
/*                  CORS CONFIG                   */
/* --------------------------------------------- */
export const corsSchema = z.object({
  enabled: z.coerce.boolean().default(true),
  allowedOrigins: z.array(z.string()).default(['*']),
});

/* --------------------------------------------- */
/*                LOGGER CONFIG                   */
/* --------------------------------------------- */
export const loggerSchema = z.object({
  level: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
  pretty: z.boolean().default(true),
});

/* --------------------------------------------- */
/*               SWAGGER CONFIG                   */
/* --------------------------------------------- */
export const swaggerSchema = z.object({
  enabled: z.coerce.boolean().default(true),
  title: z.string().default('Notifier API'),
  description: z.string().default('Notification aggregation service'),
  version: z.string().default('1.0'),
});


// @nest-template:schemas

/* --------------------------------------------- */
/*               ROOT CONFIG SCHEMA              */
/* --------------------------------------------- */
export const appConfigSchema = z.object({
  NODE_ENV: z.enum(['local', 'development', 'production', 'test']).default('development'),

  server: serverSchema,
  cors: corsSchema,
  logger: loggerSchema,
  swagger: swaggerSchema,
  // @nest-template:root-schema
});

export type AppConfig = z.infer<typeof appConfigSchema>;
