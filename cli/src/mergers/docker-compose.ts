import * as fs from 'fs-extra';
import * as path from 'path';
import { parse, stringify } from 'yaml';

export async function mergeDockerCompose(
  destDir: string,
  addonDirs: string[],
): Promise<void> {
  const filePath = path.join(destDir, 'docker-compose.yml');

  // Collect all addon docker partials
  const services: Record<string, unknown> = {};
  const volumes: Record<string, unknown> = {};

  for (const addonDir of addonDirs) {
    const partialPath = path.join(addonDir, 'docker.partial.yml');
    if (await fs.pathExists(partialPath)) {
      const content = await fs.readFile(partialPath, 'utf-8');
      const parsed = parse(content);

      if (parsed?.services) {
        Object.assign(services, parsed.services);
      }
      if (parsed?.volumes) {
        Object.assign(volumes, parsed.volumes);
      }
    }
  }

  // Build final docker-compose
  const compose: Record<string, unknown> = {};

  if (Object.keys(services).length > 0) {
    compose.services = services;
  }
  if (Object.keys(volumes).length > 0) {
    compose.volumes = volumes;
  }

  if (Object.keys(compose).length > 0) {
    await fs.writeFile(filePath, stringify(compose), 'utf-8');
  } else {
    // No docker services needed, remove the file
    await fs.remove(filePath);
  }
}
