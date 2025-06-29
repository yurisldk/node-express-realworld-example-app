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
- `ops/deploy/` — Dockerfile, docker-compose, deployment scripts
- `assets/` — static files

## Environment Variables (`.env`)

```text
DATABASE_URL=postgresql://myuser:mypassword@localhost:30432/mydb
JWT_SECRET=theSecretForCreatingTheJWT
NODE_ENV=development
PORT=3000
MIN_REQUEST_DELAY_MS=250
MAX_REQUEST_DELAY_MS=500
TEST_UTILS_TOKEN=foo.bar.baz
```

## Quick Start (Local)

```bash
yarn install
# Start PostgreSQL (locally or via Docker)
yarn migrate         # apply Prisma migrations
yarn db:seed         # seed test data (optional)
yarn dev             # start the server
```

## Docker Compose (Full Stack)

```bash
docker-compose -f ops/deploy/demo/docker-compose.yml --env-file ops/deploy/demo/.env up --build -d
```

- Frontend: http://localhost:30401
- API: http://localhost:30400
- PgAdmin: http://localhost:30433

## Links & Contacts

- [RealWorld API Spec](https://github.com/gothinkster/realworld/tree/main/api)
- [Frontend](https://github.com/yurisldk/realworld-react-fsd)
- [Issue tracker](https://github.com/yurisldk/node-express-realworld-example-app/issues)
