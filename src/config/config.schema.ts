import { z } from 'zod';

/* --------------------------------------------- */
/*                 SERVER CONFIG                  */
/* --------------------------------------------- */
export const serverSchema = z.object({
  port: z.coerce.number().default(3000),
  host: z.string().optional(),
});

/* --------------------------------------------- */
/*                   MONGO DB                     */
/* --------------------------------------------- */
export const mongoSchema = z.object({
  uri: z.url(),
  dbName: z.string(),
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

/* --------------------------------------------- */
/*              AZURE AUTH CONFIG                 */
/* --------------------------------------------- */
export const azureAuthSchema = z.object({
  tenantId: z.string(),
  audience: z.string(), // api://xxxxxx
  issuer: z.url(), // https://login.microsoftonline.com/${tenantId}/v2.0
  jwksUri: z.url(), // https://login.microsoftonline.com/${tenantId}/discovery/v2.0/keys
});

/* --------------------------------------------- */
/*               ROOT CONFIG SCHEMA              */
/* --------------------------------------------- */
export const appConfigSchema = z.object({
  NODE_ENV: z.enum(['local', 'development', 'production', 'test']).default('development'),

  server: serverSchema,
  mongo: mongoSchema,
  cors: corsSchema,
  logger: loggerSchema,
  swagger: swaggerSchema,
  azure: azureAuthSchema,
});

export type AppConfig = z.infer<typeof appConfigSchema>;
