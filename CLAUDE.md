# Nest Template Engine

## What is this project

A composable NestJS project generator. The CLI assembles a `base/` template + selected `addons/` into a working NestJS project.

This is NOT a NestJS app itself — it generates NestJS apps.

## Project structure

```
nest-ts-template/
├── base/              # NestJS template (compiles and runs standalone)
│   └── src/
│       ├── config/    # Zod-validated config (schema + loader + service)
│       ├── common/    # Logger, swagger, decorators, DTOs
│       ├── filters/   # HttpExceptionFilter
│       └── health/    # /status endpoint
├── addons/            # Composable addons
│   ├── mongodb/       # MongoDB + Mongoose (category: database)
│   ├── psql-typeorm/  # PostgreSQL + TypeORM (category: database)
│   ├── azure-ad-auth/ # Azure AD OAuth2 + RBAC (category: auth)
│   ├── http-client/   # Axios (category: feature)
│   └── dayjs/         # Day.js (category: feature)
└── cli/               # Generator CLI
    └── src/
        ├── index.ts       # Entry point (interactive + CLI args)
        ├── generator.ts   # Assembly logic
        ├── types.ts       # AddonManifest, GenerateOptions
        └── mergers/       # 5 mergers (one per file type)
```

## How the engine works

### Markers

Base files contain injection points: `// @nest-template:*` comments.
The CLI replaces them with addon content. Unused markers are cleaned up.

| Marker | File | Purpose |
|--------|------|---------|
| `// @nest-template:imports` | app.module.ts | Import statements |
| `// @nest-template:modules` | app.module.ts | Module names in imports array |
| `// @nest-template:schemas` | config.schema.ts | Zod schema definitions |
| `// @nest-template:root-schema` | config.schema.ts | Entries in root appConfigSchema |
| `// @nest-template:loader-mapping` | config.loader.ts | Env var mappings |

### Generation flow

1. Copy `base/` to destination (exclude node_modules, dist)
2. Replace project name in package.json and README.md
3. Copy each addon's `files/` into `dest/src/`
4. Run 5 mergers (package-json, app-module, config-schema, config-loader, docker-compose)
5. Generate `.env.example` from addon envVars
6. Clean unused markers

### Addon anatomy

```
addons/<name>/
├── addon.json          # Manifest (deps, scripts, envVars, imports, conflicts)
├── config.partial.ts   # Zod schema injected at // @nest-template:schemas
├── loader.partial.ts   # Env mapping injected at // @nest-template:loader-mapping
├── docker.partial.yml  # Docker services merged into docker-compose.yml
└── files/              # Copied as-is into dest/src/
```

**Convention:** `config.partial.ts` must export `const <name>Schema` — the merger auto-adds `<name>: <name>Schema` to root schema.

## Stack technique

### Base template
- NestJS 11, TypeScript 5.7, SWC
- Zod 4 (config validation)
- Pino + nestjs-pino (logging)
- Swagger/OpenAPI (auto-generated)
- Jest 30 + @swc/jest
- ESLint 9 flat config + Prettier

### CLI
- Commander (CLI args), @clack/prompts (interactive)
- fs-extra (file ops), yaml (docker-compose merge)

## Rules

- Addon files use `AppConfigService` (from `@config/config.service`), NOT `ConfigService` from `@nestjs/config`
- Path aliases: `@config/*` -> `src/config/*`, `@common/*` -> `src/common/*`
- MongoDB and PostgreSQL are compatible (no conflict, dual DB supported)
- Interactive CLI allows 1 DB selection (select). Dual DB requires CLI args.
- Do not include `Co-Authored-By` in commit messages

## How to use

```bash
# Build CLI
cd cli && npm install && npm run build

# Interactive
node dist/index.js

# One-liner
node dist/index.js --name my-project --db mongodb --auth azure-ad-auth
```

## How to create an addon

1. Create `addons/<name>/addon.json` with manifest
2. (Optional) `config.partial.ts` — Zod schema, must export `const <name>Schema`
3. (Optional) `loader.partial.ts` — env var mapping snippet
4. (Optional) `docker.partial.yml` — services and volumes
5. (Optional) `files/` — NestJS modules copied to `src/`
