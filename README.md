# Configuration and Solution for RealWorld Backend Challenges

This repository provides a solution for developers working on the RealWorld application. Due to recent changes in the [RealWorld API specifications](https://github.com/gothinkster/realworld/issues/1611), the official API server has been deleted, and the demo deployment is no longer available. As a result, developers relying on this backend have encountered issues.

This repository addresses these challenges by providing an alternative backend solution. It offers full compatibility with the updated RealWorld API specifications and can be used to keep your project running smoothly.

This fork was created specifically for use with the [RealWorld React FSD project](https://github.com/yurisldk/realworld-react-fsd), providing a seamless backend implementation for that frontend.

## Features of this Fork

### 1. Predefined `.env` Configuration

This project includes a predefined `.env` file to quickly set up a local development environment. The file contains necessary environment variables, such as the database URL and JWT secret. It is **also connected to the `docker-compose.yml` file**, ensuring that both local and containerized environments are properly configured.

However, **do not commit this file to version control** as it contains sensitive information like the JWT secret. **Always add `.env` to your `.gitignore` file** before committing any changes. While it is provided for convenience to get started quickly, you should generate your own environment files for use in production or other environments.

### 2. Predefined `docker-compose.yml` Configuration

In addition to the `.env` file, this project includes a predefined `docker-compose.yml` file. This configuration allows you to easily set up a containerized environment for your development and testing. It ensures that the necessary services, such as the database and application server, are configured and ready to run with a single command.

The `docker-compose.yml` file is pre-configured to work with Docker, simplifying the process of running the project in an isolated containerized environment. It also integrates smoothly with the `.env` file to set environment variables for the containers.

### 3. Database Seeding

This project includes a **database seeding script** that initializes the database with default data to make development and testing easier.

## ![Node/Express/Prisma Example App](project-logo.png)

### Example Node (Express + Prisma) codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld-example-apps) API spec.

## Getting started

### On the first run

1. Run `yarn install` to install the dependencies
2. To update the database in development mode use `yarn docker:start`
3. To run the development version `yarn start`

### On the other runs

1. To run the development version `yarn start`
