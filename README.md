# RealWorld Backend — Node/Express/Prisma

![Node/Express/Prisma Example App](project-logo.png)

## Description

A full-featured backend implementation of the RealWorld API specification using Node.js (Express), Prisma ORM, and PostgreSQL. Supports CRUD, authentication, tests, migrations, and Docker deployment. Serves as the backend for [realworld-react-fsd](https://github.com/yurisldk/realworld-react-fsd).

## Technologies

- Node.js, Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Nx (monorepo)
- Jest (unit/e2e tests)
- Docker, Docker Compose
- Makefile

## Directory Structure

- `src/app/routes/` — main routes (article, auth, profile, tag)
- `src/prisma/` — Prisma schema, migrations, client
- `src/tests/` — unit tests for services
- `e2e/` — e2e tests (Jest)
- `assets/` — static files

## Quick Start (Local)

Install dependencies:

```bash
yarn install
```

Run locally:

```bash
yarn migrate
yarn dev
```

Seed demo data after the API is already running:

```bash
yarn db:seed
```

- API: `http://localhost:30400/api`

## Docker Compose

Start locally with Docker:

```bash
docker compose --env-file .env.compose up -d --build
```

- API: http://localhost:30400
- PgAdmin: http://localhost:30433
- PostgreSQL: localhost:30432

Local backend and Docker backend use the same API URL: `http://localhost:30400/api`.

Stop:

```bash
docker compose --env-file .env.compose down
```

Seed demo data against the configured database:

```bash
yarn db:seed
```

## Deployment

Build image:

```bash
docker build -t realworld-api .
```

## Links & Contacts

- [RealWorld API Spec](https://github.com/gothinkster/realworld/tree/main/api)
- [Frontend](https://github.com/yurisldk/realworld-react-fsd)
- [Issue tracker](https://github.com/yurisldk/node-express-realworld-example-app/issues)
