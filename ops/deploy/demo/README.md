

# Demo Environment for RealWorld Example App

This directory contains configuration files for local demo deployment of the RealWorld Example App using Docker Compose.

---

## Contents

- `docker-compose.yml` — Docker Compose configuration for demo environment  
- `.env.compose` — Environment variables for demo (ports, credentials, etc.)

---

## Prerequisites

- Docker Engine (>= 20.10)  
- Docker Compose (>= 2.x)  
- Git (to clone the repository)

---

## Getting Started

1. **Copy environment file**

```bash
cp .env.compose.example .env.compose
```

2. **Edit `.env.compose`** (optional) to customize ports or credentials for your local environment.

3. **Start the demo environment**

```bash
docker-compose --env-file .env.compose up --build
```

4. **Access the services**

- **Frontend:** http://localhost:30401  
- **Backend API:** http://localhost:30400  
- **pgAdmin:** http://localhost:30433

---

## Stopping and Cleanup

To stop the environment and remove containers:

```bash
docker-compose --env-file .env.compose down
```

To remove volumes (data will be lost):

```bash
docker-compose --env-file .env.compose down -v
```

---

## Notes

- This environment is designed for demo and development purposes only.  
- Do **not** use this configuration in production.  
- Environment variables use safe defaults and fake credentials.

---

## Troubleshooting

- Make sure Docker daemon is running.  
- Ensure no conflicting services are running on the mapped ports.  
- Use `docker-compose logs` to view logs from containers.

---

## Support

If you encounter any issues, please open an issue in the main project repository.

---

*Enjoy exploring the RealWorld Example App demo environment!*