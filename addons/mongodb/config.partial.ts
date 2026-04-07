/* --------------------------------------------- */
/*                MONGO CONFIG                    */
/* --------------------------------------------- */
export const mongoSchema = z.object({
  uri: z.string().default('mongodb://localhost:27017'),
  dbName: z.string(),
});
