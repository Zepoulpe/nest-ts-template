# nest-ts-template

## Description

NestJS backend application.

## Getting started

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start in development mode
npm run start:dev

# Start with SWC (faster)
npm run dev
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Build the project |
| `npm run start:dev` | Start with watch mode |
| `npm run dev` | Start with SWC watch mode |
| `npm run start:prod` | Start production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Run Prettier |
| `npm test` | Run unit tests |
| `npm run test:e2e` | Run e2e tests |

## API Documentation

Swagger is available at `/docs` when `SWAGGER_ENABLED=true`.

## Project structure

```
src/
├── config/         # Zod-validated configuration
├── common/         # Shared modules (logger, swagger, decorators, DTOs)
├── filters/        # Exception filters
└── health/         # Health check endpoint (/status)
```

---

> Generated with [nest-ts-template](https://github.com/Zepoulpe/nest-ts-template)
