#!/usr/bin/env node

import * as p from '@clack/prompts';
import { Command } from 'commander';
import * as path from 'path';
import { discoverAddons, checkConflicts, generate } from './generator';
import { AddonManifest } from './types';

const program = new Command();

program
  .name('create-nest-app')
  .description('Génère un projet NestJS à partir du template composable')
  .version('1.0.0')
  .option('--name <name>', 'Nom du projet')
  .option('--db <addon>', 'Addon database (ex: mongodb, psql-typeorm, psql-prisma)')
  .option('--auth <addon>', 'Addon auth (ex: oauth2-microsoft)')
  .option('--features <addons>', 'Addons features séparés par des virgules (ex: websockets,cron)')
  .option('--output <dir>', 'Dossier de sortie', '.')
  .action(async (opts) => {
    // If CLI args are provided, run in non-interactive mode
    if (opts.name) {
      await runNonInteractive(opts);
    } else {
      await runInteractive(opts.output);
    }
  });

program.parse();

async function runNonInteractive(opts: {
  name: string;
  db?: string;
  auth?: string;
  features?: string;
  output: string;
}) {
  const addons: string[] = [];
  if (opts.db) addons.push(opts.db);
  if (opts.auth) addons.push(opts.auth);
  if (opts.features) addons.push(...opts.features.split(','));

  const allAddons = discoverAddons();

  // Validate addon names
  for (const name of addons) {
    if (!allAddons.has(name)) {
      console.error(`Addon "${name}" introuvable. Disponibles: ${Array.from(allAddons.keys()).join(', ')}`);
      process.exit(1);
    }
  }

  // Check conflicts
  const conflict = checkConflicts(addons, allAddons);
  if (conflict) {
    console.error(conflict);
    process.exit(1);
  }

  console.log(`Génération du projet "${opts.name}" avec les addons: ${addons.length > 0 ? addons.join(', ') : 'aucun'}...`);

  await generate({
    projectName: opts.name,
    addons,
    outputDir: opts.output,
  });

  console.log(`Projet généré dans ./${opts.name}`);
}

async function runInteractive(outputDir: string) {
  p.intro('Nest Template Engine');

  const allAddons = discoverAddons();

  // Group addons by category
  const databases = filterByCategory(allAddons, 'database');
  const auths = filterByCategory(allAddons, 'auth');
  const features = filterByCategory(allAddons, 'feature');

  // Project name
  const projectName = await p.text({
    message: 'Nom du projet ?',
    placeholder: 'mon-projet',
    validate: (value) => {
      if (!value) return 'Le nom est requis';
      if (!/^[a-z0-9-]+$/.test(value)) return 'Utilise uniquement des minuscules, chiffres et tirets';
    },
  });

  if (p.isCancel(projectName)) {
    p.cancel('Annulé.');
    process.exit(0);
  }

  const selectedAddons: string[] = [];

  // Database selection
  if (databases.length > 0) {
    const dbChoice = await p.select({
      message: 'Database ?',
      options: [
        { value: 'none', label: 'Aucune' },
        ...databases.map((d) => ({
          value: d.name,
          label: d.manifest.description,
        })),
      ],
    });

    if (p.isCancel(dbChoice)) {
      p.cancel('Annulé.');
      process.exit(0);
    }

    if (dbChoice !== 'none') {
      selectedAddons.push(dbChoice as string);
    }
  }

  // Auth selection
  if (auths.length > 0) {
    const authChoice = await p.select({
      message: 'Authentification ?',
      options: [
        { value: 'none', label: 'Aucune' },
        ...auths.map((a) => ({
          value: a.name,
          label: a.manifest.description,
        })),
      ],
    });

    if (p.isCancel(authChoice)) {
      p.cancel('Annulé.');
      process.exit(0);
    }

    if (authChoice !== 'none') {
      selectedAddons.push(authChoice as string);
    }
  }

  // Features selection (multiselect)
  if (features.length > 0) {
    const featureChoices = await p.multiselect({
      message: 'Features additionnelles ?',
      options: features.map((f) => ({
        value: f.name,
        label: f.manifest.description,
      })),
      required: false,
    });

    if (p.isCancel(featureChoices)) {
      p.cancel('Annulé.');
      process.exit(0);
    }

    selectedAddons.push(...(featureChoices as string[]));
  }

  // Check conflicts
  const conflict = checkConflicts(selectedAddons, allAddons);
  if (conflict) {
    p.log.error(conflict);
    process.exit(1);
  }

  // Summary
  p.log.info(
    selectedAddons.length > 0
      ? `Addons sélectionnés: ${selectedAddons.join(', ')}`
      : 'Aucun addon sélectionné (template de base)',
  );

  const spinner = p.spinner();
  spinner.start('Génération du projet...');

  try {
    await generate({
      projectName: projectName as string,
      addons: selectedAddons,
      outputDir: outputDir,
    });

    spinner.stop('Projet généré !');

    p.note(
      [
        `cd ${projectName}`,
        'npm install',
        'cp .env.example .env',
        'npm run start:dev',
      ].join('\n'),
      'Prochaines étapes',
    );

    p.outro('Bon dev !');
  } catch (err) {
    spinner.stop('Erreur lors de la génération');
    p.log.error(String(err));
    process.exit(1);
  }
}

function filterByCategory(
  addons: Map<string, AddonManifest>,
  category: string,
): { name: string; manifest: AddonManifest }[] {
  const result: { name: string; manifest: AddonManifest }[] = [];
  for (const [name, manifest] of addons) {
    if (manifest.category === category) {
      result.push({ name, manifest });
    }
  }
  return result;
}
