# CiTBIN Infrastructure

The infrastructure layer provides the services required to run the CiTBIN platform locally and in development environments. It is responsible for provisioning databases, networking, and supporting services using Docker Compose.

The application itself is **not** started from this directory. Instead, this directory provides the infrastructure that the backend and frontend depend on.

---

# Purpose

The infrastructure stack is designed to provide a reproducible development environment.

It currently provides:

* PostgreSQL database
* Docker networking
* Persistent data volumes
* Environment configuration
* Service orchestration

The backend and frontend connect to these services during startup.

---

# Architecture

```text
                     +---------------------+
                     |   Docker Network    |
                     +----------+----------+
                                |
                 +--------------+--------------+
                 |                             |
                 |                             |
          PostgreSQL                    Other Services
                 |                             |
                 +--------------+--------------+
                                |
                       FastAPI Backend
                                |
                         REST API
                                |
                       Next.js Frontend
```

---

# Directory Structure

```text
infrastructure/

├── docker-compose.yml
├── .env.example
├── postgres/
│   ├── init/
│   └── data/
└── README.md
```

Depending on the deployment environment, additional configuration files may exist for development or production.

---

# Requirements

Before starting the infrastructure, install:

| Software                       | Version |
| ------------------------------ | ------- |
| Docker Desktop / Docker Engine | Latest  |
| Docker Compose                 | v2+     |

Verify your installation.

```bash
docker --version

docker compose version
```

---

# Starting the Infrastructure

Navigate to the infrastructure directory.

```bash
cd infrastructure
```

Start all configured services.

```bash
docker compose up -d
```

Docker will automatically:

* create the required network
* create persistent volumes
* start PostgreSQL
* attach all configured services

---

# Stopping the Infrastructure

Stop all running containers.

```bash
docker compose down
```

Containers are removed, while database data remains stored in Docker volumes.

---

# Rebuilding Containers

If Dockerfiles or images change, rebuild the infrastructure.

```bash
docker compose up --build
```

---

# Viewing Logs

To inspect running services:

```bash
docker compose logs
```

Follow logs continuously.

```bash
docker compose logs -f
```

View logs for PostgreSQL only.

```bash
docker compose logs postgres
```

---

# PostgreSQL

The backend stores all persistent data inside PostgreSQL.

Typical data includes:

* devices
* waste bins
* measurements
* historical sensor data
* metadata

The backend automatically applies database migrations during startup.

---

# Persistent Storage

Database files are stored inside Docker volumes.

This ensures that data is retained even if containers are recreated.

To remove all stored data:

```bash
docker compose down -v
```

**Warning:** This permanently deletes the development database.

---

# Environment Variables

Configuration is managed using environment files.

Typical variables include:

```env
POSTGRES_DB=citbin

POSTGRES_USER=postgres

POSTGRES_PASSWORD=password
```

The backend uses its own `.env` file to connect to the database.

---

# Networking

All services communicate over the Docker network created by Docker Compose.

Typical communication flow:

```text
Frontend
     │
 REST API
     │
Backend
     │
 PostgreSQL
```

The frontend never communicates directly with the database.

---

# Development Workflow

Start the infrastructure before launching the backend.

Typical order:

1. Start Docker infrastructure.
2. Start the backend.
3. Wait for database migrations.
4. Verify MQTT connection.
5. Start the frontend.
6. Open the web application.

---

# Updating the Database

Database schema changes are managed with Alembic.

After modifying models:

```bash
uv run alembic revision --autogenerate -m "Description"

uv run alembic upgrade head

uv run alembic stamp head
```

No manual SQL changes should be required.

---

# Common Commands

Start services.

```bash
docker compose up -d
```

Stop services.

```bash
docker compose down
```

Restart services.

```bash
docker compose restart
```

View running containers.

```bash
docker compose ps
```

View logs.

```bash
docker compose logs -f
```

Rebuild images.

```bash
docker compose up --build
```

Remove everything, including volumes.

```bash
docker compose down -v
```

---

# Troubleshooting

## PostgreSQL is unavailable

Check whether the container is running.

```bash
docker compose ps
```

Review the logs.

```bash
docker compose logs postgres
```

---

## Backend cannot connect

Verify:

* PostgreSQL is running.
* The database credentials match the backend `.env`.
* Docker networking is functioning correctly.

---

## Containers fail to start

Run:

```bash
docker compose logs
```

Most startup issues are caused by invalid environment variables or ports already being in use.

---

# Best Practices

* Keep infrastructure configuration under version control.
* Never commit production secrets.
* Use `.env.example` files for configuration templates.
* Keep Docker images lightweight.
* Rebuild containers after dependency updates.
* Use named volumes to preserve database data.

---

# Related Documentation

* Root Documentation: `../README.md`
* Backend Documentation: `../apps/api/README.md`
* Frontend Documentation: `../apps/web/README.md`

---

# Future Improvements

Potential infrastructure enhancements include:

* Automated backups 💀
* Health monitoring ♠️

These additions would improve scalability, observability, and deployment flexibility as the project grows.
