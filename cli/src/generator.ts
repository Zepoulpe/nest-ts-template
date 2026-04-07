import * as fs from 'fs-extra';
import * as path from 'path';
import { AddonManifest, GenerateOptions } from './types';
import { mergePackageJson } from './mergers/package-json';
import { mergeAppModule } from './mergers/app-module';
import { mergeConfigSchema } from './mergers/config-schema';
import { mergeConfigLoader } from './mergers/config-loader';
import { mergeDockerCompose } from './mergers/docker-compose';

const ROOT_DIR = path.resolve(__dirname, '..', '..');
const BASE_DIR = path.join(ROOT_DIR, 'base');
const ADDONS_DIR = path.join(ROOT_DIR, 'addons');

export function discoverAddons(): Map<string, AddonManifest> {
  const addons = new Map<string, AddonManifest>();

  if (!fs.pathExistsSync(ADDONS_DIR)) {
    return addons;
  }

  const entries = fs.readdirSync(ADDONS_DIR, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const manifestPath = path.join(ADDONS_DIR, entry.name, 'addon.json');
    if (fs.pathExistsSync(manifestPath)) {
      const manifest = fs.readJsonSync(manifestPath) as AddonManifest;
      addons.set(entry.name, manifest);
    }
  }

  return addons;
}

export function checkConflicts(
  selectedNames: string[],
  allAddons: Map<string, AddonManifest>,
): string | null {
  for (const name of selectedNames) {
    const addon = allAddons.get(name);
    if (!addon?.conflicts) continue;

    for (const conflict of addon.conflicts) {
      if (selectedNames.includes(conflict)) {
        return `L'addon "${name}" est incompatible avec "${conflict}"`;
      }
    }
  }
  return null;
}

export async function generate(options: GenerateOptions): Promise<void> {
  const { projectName, addons: addonNames, outputDir } = options;
  const destDir = path.resolve(outputDir, projectName);

  // 1. Copy base
  await fs.copy(BASE_DIR, destDir, {
    filter: (src: string) => {
      const rel = path.relative(BASE_DIR, src);
      return !rel.startsWith('node_modules') && !rel.startsWith('dist');
    },
  });

  // Update project name in package.json
  const pkgPath = path.join(destDir, 'package.json');
  const pkg = await fs.readJson(pkgPath);
  pkg.name = projectName;
  await fs.writeJson(pkgPath, pkg, { spaces: 2 });

  // 2. Load selected addon manifests
  const allAddons = discoverAddons();
  const selectedManifests: AddonManifest[] = [];
  const selectedAddonDirs: string[] = [];

  for (const name of addonNames) {
    const manifest = allAddons.get(name);
    if (!manifest) {
      throw new Error(`Addon "${name}" introuvable`);
    }
    selectedManifests.push(manifest);
    selectedAddonDirs.push(path.join(ADDONS_DIR, name));
  }

  // 3. Copy addon files
  for (const addonDir of selectedAddonDirs) {
    const filesDir = path.join(addonDir, 'files');
    if (await fs.pathExists(filesDir)) {
      await fs.copy(filesDir, path.join(destDir, 'src'));
    }
  }

  // 4. Run mergers
  await mergePackageJson(destDir, selectedManifests);
  await mergeAppModule(destDir, selectedManifests);
  await mergeConfigSchema(destDir, selectedAddonDirs);
  await mergeConfigLoader(destDir, selectedAddonDirs);
  await mergeDockerCompose(destDir, selectedAddonDirs);

  // 5. Generate .env.example
  await generateEnvExample(destDir, selectedManifests);

  // 6. Clean remaining markers
  await cleanMarkers(destDir);
}

async function generateEnvExample(
  destDir: string,
  addons: AddonManifest[],
): Promise<void> {
  const lines: string[] = [
    '# Base configuration',
    'PORT=3000',
    'HOST=localhost',
    'NODE_ENV=development',
    '',
    'LOGGER_LEVEL=debug',
    'LOGGER_JSON=false',
    '',
    'CORS_ENABLED=true',
    'CORS_ALLOWED_ORIGINS=http://localhost:3000',
    '',
    'SWAGGER_ENABLED=true',
  ];

  for (const addon of addons) {
    if (addon.envVars && Object.keys(addon.envVars).length > 0) {
      lines.push('');
      lines.push(`# ${addon.description}`);
      for (const [key, defaultValue] of Object.entries(addon.envVars)) {
        lines.push(`${key}=${defaultValue}`);
      }
    }
  }

  lines.push('');
  await fs.writeFile(path.join(destDir, '.env.example'), lines.join('\n'), 'utf-8');
}

async function cleanMarkers(destDir: string): Promise<void> {
  const markerPattern = /\s*\/\/\s*@nest-template:\S+\n?/g;
  const yamlMarkerPattern = /\s*#\s*@nest-template:\S+\n?/g;

  const filesToClean = [
    path.join(destDir, 'src', 'app.module.ts'),
    path.join(destDir, 'src', 'config', 'config.schema.ts'),
    path.join(destDir, 'src', 'config', 'config.loader.ts'),
  ];

  for (const filePath of filesToClean) {
    if (await fs.pathExists(filePath)) {
      let content = await fs.readFile(filePath, 'utf-8');
      content = content.replace(markerPattern, '\n');
      // Clean up multiple blank lines
      content = content.replace(/\n{3,}/g, '\n\n');
      await fs.writeFile(filePath, content, 'utf-8');
    }
  }

  // Clean docker-compose markers
  const dockerPath = path.join(destDir, 'docker-compose.yml');
  if (await fs.pathExists(dockerPath)) {
    let content = await fs.readFile(dockerPath, 'utf-8');
    content = content.replace(yamlMarkerPattern, '\n');
    content = content.replace(/\n{3,}/g, '\n\n');
    await fs.writeFile(dockerPath, content, 'utf-8');
  }
}
