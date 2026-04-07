import * as fs from 'fs-extra';
import * as path from 'path';
import { AddonManifest } from '../types';

export async function mergeAppModule(
  destDir: string,
  addons: AddonManifest[],
): Promise<void> {
  const filePath = path.join(destDir, 'src', 'app.module.ts');
  let content = await fs.readFile(filePath, 'utf-8');

  const importStatements: string[] = [];
  const moduleNames: string[] = [];

  for (const addon of addons) {
    for (const imp of addon.imports) {
      importStatements.push(`import { ${imp.module} } from '${imp.path}';`);
      moduleNames.push(imp.module);
    }
  }

  // Replace markers
  content = content.replace(
    '// @nest-template:imports',
    importStatements.length > 0 ? importStatements.join('\n') : '',
  );

  content = content.replace(
    '// @nest-template:modules',
    moduleNames.length > 0 ? moduleNames.join(',\n    ') + ',' : '',
  );

  await fs.writeFile(filePath, content, 'utf-8');
}
