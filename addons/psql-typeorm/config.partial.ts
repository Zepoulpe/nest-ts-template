/* --------------------------------------------- */
/*               POSTGRESQL CONFIG               */
/* --------------------------------------------- */
export const postgresSchema = z.object({
  host: z.string(),
  port: z.coerce.number().default(5432),
  username: z.string(),
  password: z.string(),
  database: z.string(),
  ssl: z.preprocess((v) => v === 'true' || v === true, z.boolean()).default(false),
});
