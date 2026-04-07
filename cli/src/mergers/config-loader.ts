import * as fs from 'fs-extra';
import * as path from 'path';

export async function mergeConfigLoader(
  destDir: string,
  addonDirs: string[],
): Promise<void> {
  const filePath = path.join(destDir, 'src', 'config', 'config.loader.ts');
  let content = await fs.readFile(filePath, 'utf-8');

  const loaderBlocks: string[] = [];

  for (const addonDir of addonDirs) {
    const partialPath = path.join(addonDir, 'loader.partial.ts');
    if (await fs.pathExists(partialPath)) {
      const partial = await fs.readFile(partialPath, 'utf-8');
      loaderBlocks.push(partial.trimEnd());
    }
  }

  content = content.replace(
    '    // @nest-template:loader-mapping',
    loaderBlocks.length > 0 ? loaderBlocks.join('\n') : '',
  );

  await fs.writeFile(filePath, content, 'utf-8');
}
