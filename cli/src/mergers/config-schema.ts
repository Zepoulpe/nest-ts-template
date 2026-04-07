import * as fs from 'fs-extra';
import * as path from 'path';

export async function mergeConfigSchema(
  destDir: string,
  addonDirs: string[],
): Promise<void> {
  const filePath = path.join(destDir, 'src', 'config', 'config.schema.ts');
  let content = await fs.readFile(filePath, 'utf-8');

  const schemaBlocks: string[] = [];
  const rootSchemaEntries: string[] = [];

  for (const addonDir of addonDirs) {
    const partialPath = path.join(addonDir, 'config.partial.ts');
    if (await fs.pathExists(partialPath)) {
      const partial = await fs.readFile(partialPath, 'utf-8');
      schemaBlocks.push(partial);

      // Extract exported const names to add to root schema
      // e.g. "export const mongoSchema" -> "mongo: mongoSchema"
      const matches = partial.matchAll(/export const (\w+)Schema/g);
      for (const match of matches) {
        const name = match[1]; // e.g. "mongo"
        rootSchemaEntries.push(`  ${name}: ${name}Schema,`);
      }
    }
  }

  // Replace markers
  content = content.replace(
    '// @nest-template:schemas',
    schemaBlocks.length > 0 ? schemaBlocks.join('\n') : '',
  );

  content = content.replace(
    '  // @nest-template:root-schema',
    rootSchemaEntries.length > 0 ? rootSchemaEntries.join('\n') : '',
  );

  await fs.writeFile(filePath, content, 'utf-8');
}
