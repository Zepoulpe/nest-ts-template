/* --------------------------------------------- */
/*              AZURE AUTH CONFIG                 */
/* --------------------------------------------- */
export const azureSchema = z.object({
  tenantId: z.string(),
  audience: z.string(),
  issuer: z.string(),
  jwksUri: z.string(),
  scopes: z.string(),
  clientIdFront: z.string(),
});
