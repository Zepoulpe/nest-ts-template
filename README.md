# 🚀 Nest Starter Template
**Modern NestJS Project Starter — Fast, Typed, Scalable**

Template minimaliste mais robuste pour démarrer rapidement un projet NestJS **professionnel**, avec :

✔️ SWC (compilation ultra rapide)  
✔️ Zod pour la validation de config  
✔️ Pino logger (pretty logs & JSON logs prod)  
✔️ Swagger auto configuré  
✔️ Healthcheck `/status`  
✔️ Architecture clean & scalable  
✔️ CORS + Validation + Filters globaux  
✔️ Optimisé AWS (env vars)  
✔️ Structure pensée pour projets pro

---

## 📦 Features

### 🔧 Tech Stack
- **NestJS 10+**
- **TypeScript 5+**
- **SWC compiler** (x10 plus rapide que tsc)
- **Pino logger** via `nestjs-pino`
- **Zod** pour schémas de configuration robustes
- **Swagger** généré automatiquement
- **CORS configurables**
- **Validation globale (class-validator)**
- **Exception filters**
- **Healthcheck `/status`**
- **Architecture scalable**
- **Optimisé AWS**

---

## 🏁 Getting Started

### 1. Cloner le repo
```bash
git clone https://github.com/Zepoulpe/nest-ts-template.git
cd nest-ts-template
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Créer votre fichier `.env`
Exemple minimal requis pour démarrer :

```
PORT=3000
NODE_ENV=development
APP_NAME=Nest Starter Template

LOGGER_LEVEL=debug
LOGGER_JSON=false

CORS_ALLOWED_ORIGINS=["http://localhost:3000"]

SWAGGER_ENABLED=true
```

---

## ▶️ Scripts utiles

### Développement
```bash
npm run start:dev
```

### Build production
```bash
npm run build
```

### Lancer en production
```bash
npm run start:prod
```

### Linter
```bash
npm run lint
```

### Linter + fix
```bash
npm run lint:fix
```

---

## 📁 Structure du projet

```
openapi/
src/
├── app.module.ts
├── main.ts
│
├── config/
│   ├── config.module.ts
│   ├── config.schema.ts
│   ├── config.service.ts
│
├── common/
│   ├── filters/
│   │   ├── http-exception.filter.ts
│   │   └── mongo-exception.filter.ts
│   ├── utils/
│   │   └── dayjs.ts
│   └── interceptors/
│
├── modules/
│   ├── health/
│   │   ├── health.controller.ts
│   │   └── health.module.ts
│   └── example/

```

---

## 📘 Swagger
Disponible automatiquement si `SWAGGER_ENABLED=true`.

```
http://localhost:3000/docs
```

---

## 🩺 Healthcheck
```
GET /status
```

Renvoie :

```json
{
  "status": "ok",
  "timestamp": "2025-03-12T10:12:00.000Z"
}
```

---

## 🔧 Configuration via Zod

Validation stricte des variables d’environnement :
- Empêche les valeurs manquantes
- Sécurise la configuration
- Structure fortement typée

---

## 📖 Logging (Pino)

**DEV** → pretty logs colorés  
**PROD** → JSON compact pour AWS / ELK / Datadog

---

## 🛡️ CORS & Security

CORS configurables via `.env`  
Headers stricts en production

---

## 🧩 Filters globaux
- `HttpExceptionFilter`

Gestion homogène des erreurs API.

---

## 🧰 Outils intégrés

✔️ SWC  
✔️ ESLint + Prettier  
✔️ Scripts dev/prod  
✔️ Structure modulaire

---

## 📜 Licence
MIT (libre de droit)
