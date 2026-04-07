import * as fs from 'fs-extra';
import * as path from 'path';
import { AddonManifest } from '../types';

export async function mergePackageJson(
  destDir: string,
  addons: AddonManifest[],
): Promise<void> {
  const pkgPath = path.join(destDir, 'package.json');
  const pkg = await fs.readJson(pkgPath);

  for (const addon of addons) {
    if (addon.dependencies) {
      pkg.dependencies = { ...pkg.dependencies, ...addon.dependencies };
    }
    if (addon.devDependencies) {
      pkg.devDependencies = { ...pkg.devDependencies, ...addon.devDependencies };
    }
  }

  // Sort dependencies alphabetically
  pkg.dependencies = sortObject(pkg.dependencies);
  pkg.devDependencies = sortObject(pkg.devDependencies);

  await fs.writeJson(pkgPath, pkg, { spaces: 2 });
}

function sortObject(obj: Record<string, string>): Record<string, string> {
  return Object.keys(obj)
    .sort()
    .reduce(
      (sorted, key) => {
        sorted[key] = obj[key];
        return sorted;
      },
      {} as Record<string, string>,
    );
}
