# Configuration and Solution for RealWorld Backend Challenges

This repository provides a solution for developers working on the RealWorld application. Due to recent changes in the [RealWorld API specifications](https://github.com/gothinkster/realworld/issues/1611), the official API server has been deleted, and the demo deployment is no longer available. As a result, developers relying on this backend have encountered issues.

This repository addresses these challenges by providing an alternative backend solution. It offers full compatibility with the updated RealWorld API specifications and can be used to keep your project running smoothly.

This fork was created specifically for use with the [RealWorld React FSD project](https://github.com/yurisldk/realworld-react-fsd), providing a seamless backend implementation for that frontend.

## ![Node/Express/Prisma Example App](project-logo.png)

### Example Node (Express + Prisma) codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld-example-apps) API spec.

## Getting started

To get the backend running locally:

1. Clone this repo
2. Ensure you have a running PostgreSQL instance (e.g. via Docker or local installation)
3. `yarn install` to install all the dependencies defined in a `package.json` file
4. `yarn dev` to start the development server

## Scripts

- `yarn dev` — Starts the full development environment: Docker containers, database migrations + seed, and Nx server.
- `yarn build` — Builds the project using Nx.
- `yarn test` — Runs unit tests using Nx.
- `yarn docker:up` — Starts Docker containers in detached mode.
- `yarn docker:down` — Stops Docker containers, removes volumes and orphan containers.
- `yarn migrate` — Applies all pending Prisma database migrations.
- `yarn seed` — Seeds the database if not already seeded (`.seed_done` marker).
- `yarn init:db` — Initializes the database: applies migrations and seeds.
- `yarn reset:db` — Fully resets and reinitializes the database from scratch.

## 🧪 Demo Environment

You can run both the frontend (this repo) and the backend ([node-express-realworld-example-app](https://github.com/yurisldk/node-express-realworld-example-app)) together using Docker Compose.

A demo setup is available in [`ops/deploy/demo`](./ops/deploy/demo), which includes preconfigured services:
  
- Frontend (React app)
- Backend API (Node.js + Express + Prisma)
- PostgreSQL database
- PgAdmin for DB inspection

### Run the fullstack demo

Make sure Docker is installed, then from the project root run:

```bash
docker-compose -f ops/deploy/demo/docker-compose.yml --env-file ops/deploy/demo/.env up --build -d
```

Once started, you can access:

- Frontend: http://localhost:30401
- API: http://localhost:30400
- PgAdmin: http://localhost:30433