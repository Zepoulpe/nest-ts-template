# Nest Template Engine

![Template Repository](https://img.shields.io/badge/Template-Yes-blue?style=flat-square&logo=github)

**Moteur de template NestJS composable** — Genere un projet NestJS professionnel en selectionnant les addons dont tu as besoin.

## Features de base

- **NestJS 11+** / **TypeScript 5+**
- **SWC compiler** (x10 plus rapide que tsc)
- **Pino logger** (pretty logs dev, JSON prod)
- **Zod** pour la validation de config
- **Swagger** auto-genere
- **Healthcheck** `/status`
- **CORS + Validation + Exception filters**
- **ESLint + Prettier**

## Addons disponibles

| Addon | Categorie | Description |
|-------|-----------|-------------|
| `mongodb` | database | MongoDB avec Mongoose |
| `psql-typeorm` | database | PostgreSQL avec TypeORM *(a venir)* |
| `psql-prisma` | database | PostgreSQL avec Prisma *(a venir)* |
| `oauth2-microsoft` | auth | Validation token Azure AD *(a venir)* |
| `websockets` | feature | WebSockets *(a venir)* |
| `cron` | feature | Scheduled tasks *(a venir)* |
| `graphql` | feature | GraphQL *(a venir)* |
| `microservices` | feature | Microservices *(a venir)* |

---

## Getting Started

### Mode interactif

```bash
cd cli && npm install && npm run build
node dist/index.js
```

```
◆  Nom du projet ?
│  mon-projet
◆  Database ?
│  ● MongoDB (Mongoose)
│  ○ Aucune
◆  Authentification ?
│  ○ Aucune
◆  Projet genere !

  cd mon-projet
  npm install
  cp .env.example .env
  npm run start:dev
```

### Mode one-liner

```bash
# Projet avec MongoDB
node cli/dist/index.js --name mon-projet --db mongodb

# Projet de base (sans addon)
node cli/dist/index.js --name mon-projet

# Toutes les options
node cli/dist/index.js --name mon-projet --db mongodb --auth oauth2-microsoft --features websockets,cron --output ./projets
```

---

## Structure du repo

```
nest-ts-template/
├── base/                  # Template NestJS de base
│   ├── src/
│   │   ├── app.module.ts
│   │   ├── main.ts
│   │   ├── config/        # Config Zod (schema, loader, service)
│   │   ├── common/        # Utils, decorators, DTOs, logger
│   │   ├── filters/       # Exception filters
│   │   └── health/        # Healthcheck /status
│   ├── package.json
│   └── ...
├── addons/                # Addons composables
│   └── mongodb/
│       ├── addon.json
│       ├── files/         # Fichiers source a copier
│       ├── config.partial.ts
│       ├── loader.partial.ts
│       └── docker.partial.yml
├── cli/                   # CLI de generation
│   └── src/
│       ├── index.ts       # Point d'entree + prompts
│       ├── generator.ts   # Logique d'assemblage
│       └── mergers/       # Merge des fichiers partages
└── README.md
```

---

## Creer un nouvel addon

Cree un dossier dans `addons/` avec cette structure :

```
addons/mon-addon/
├── addon.json             # Manifest (obligatoire)
├── files/                 # Fichiers a copier dans src/ (optionnel)
├── config.partial.ts      # Schema Zod a ajouter (optionnel)
├── loader.partial.ts      # Mapping env vars (optionnel)
└── docker.partial.yml     # Service docker (optionnel)
```

### addon.json

```json
{
  "name": "mon-addon",
  "description": "Description de l'addon",
  "category": "database | auth | feature",
  "dependencies": {
    "ma-lib": "^1.0.0"
  },
  "envVars": {
    "MA_VAR": "valeur-par-defaut"
  },
  "imports": [
    {
      "module": "MonModule",
      "path": "./mon-dossier/mon.module"
    }
  ],
  "conflicts": ["addon-incompatible"]
}
```

Le CLI detecte automatiquement les nouveaux addons.

---

## Scripts du projet genere

```bash
npm run start:dev    # Dev avec hot reload
npm run build        # Build production
npm run start:prod   # Lancer en production
npm run lint         # Linter
```

---

## Configuration (Zod)

Validation stricte des variables d'environnement via Zod. Chaque addon ajoute automatiquement ses variables au schema. Le fichier `.env.example` est genere avec toutes les variables necessaires.

---

## Swagger

Disponible si `SWAGGER_ENABLED=true` :

```
http://localhost:3000/docs
```

---

## Healthcheck

```
GET /status → { "status": "ok", "timestamp": "..." }
```

---

## Licence

MIT
