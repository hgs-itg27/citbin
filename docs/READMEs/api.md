# CiTBIN Backend API

The CiTBIN Backend is the central component of the platform. It receives sensor data from the MQTT broker, decodes incoming payloads, processes measurements, stores them in PostgreSQL, and exposes a REST API for the frontend and other clients.

The backend is built with **FastAPI** and follows a modular architecture to make it easy to integrate new sensor types, waste bin models, and processing logic.

---

# Features

* FastAPI REST API
* MQTT client for mioty sensor communication
* Automatic payload decoding
* Device management
* Waste bin management
* Historical measurement storage
* PostgreSQL integration
* Automatic database migrations
* OpenAPI documentation
* Modular sensor architecture
* Extensible payload processing
* Unit testing

---

# Technology Stack

| Component         | Technology            |
| ----------------- | --------------------- |
| Language          | Python 3.11+          |
| Framework         | FastAPI               |
| Database          | PostgreSQL            |
| ORM               | SQLModel / SQLAlchemy |
| Migrations        | Alembic               |
| MQTT              | Paho MQTT             |
| ASGI Server       | Uvicorn               |
| Production Server | Gunicorn              |

---

# Architecture

```text
                   MQTT Broker
                         │
                         ▼
                MQTT Client Service
                         │
                         ▼
                Payload Decoder
                         │
                         ▼
                Sensor Factory
                         │
          ┌──────────────┴──────────────┐
          ▼                             ▼
   Sensor Implementation         Trash Bin Factory
          │                             │
          └──────────────┬──────────────┘
                         ▼
                 Business Services
                         ▼
                PostgreSQL Database
                         ▼
                    REST API
                         ▼
                    Web Frontend
```

---

# Project Structure

```text
apps/api/

├── api/
│   ├── device_service.py
│   ├── trashbin_service.py
│   ├── trashbin_repository.py
│   ├── device_repository.py
│   └── mioty_service.py
│
├── models/
│
├── modules/
│   ├── sensors/
│   ├── trashbins/
│   ├── payload_decoder.py
│   ├── process_data.py
│   ├── sensor_factory.py
│   ├── trashbin_factory.py
│   ├── auto_migrate.py
│   └── postgresql.py
│
├── routers/
│
├── migrations/
│
├── tests/
│
└── app.py
```

---

# Core Components

## app.py

Application entry point.

Responsible for:

* starting FastAPI
* configuring logging
* loading environment variables
* connecting to PostgreSQL
* running database migrations
* connecting to the MQTT broker
* registering API routes
* enabling CORS

---

## MQTT Service

The MQTT service establishes a connection to the configured broker and subscribes to incoming mioty messages.

Responsibilities:

* broker connection
* reconnect handling
* message reception
* forwarding payloads to the processing pipeline

The MQTT service acts as the bridge between the physical sensor network and the backend.

---

## Payload Decoder

Incoming MQTT payloads are not directly stored.

Instead they are:

* validated
* decoded
* normalized
* converted into internal data models

This allows the backend to support multiple sensor manufacturers without changing the API.

---

## Sensor Factory

The Sensor Factory determines which sensor implementation should process an incoming payload.

Advantages:

* easy extension
* manufacturer independence
* clean separation of logic
* reusable sensor implementations

Adding a new sensor usually requires:

1. creating a new sensor class
2. implementing the decoder
3. registering it in the factory

No other backend logic should require modification.

---

## Trash Bin Factory

The Trash Bin Factory contains waste-bin-specific logic.

Different waste bins may calculate fill levels differently or expose additional metadata.

The factory keeps this logic isolated from the rest of the backend.

---

## Business Services

Business services contain the application logic.

Examples include:

* creating devices
* updating measurements
* validating requests
* assigning devices to waste bins

Repositories are responsible only for database access.

---

# Database

The backend uses PostgreSQL together with SQLModel.

Main entities include:

## Device

Stores information about installed sensor devices.

Examples:

* device identifier
* hardware information
* battery status
* assigned waste bin

---

## Trash Bin

Represents a physical waste bin.

Typical information:

* name
* location
* coordinates
* type
* current fill level

---

## Measurement History

Stores historical measurements received from sensors.

Typical data:

* timestamp
* fill level
* measured distance
* battery information
* signal quality

Historical data allows long-term analysis and visualization.

---

# REST API

The backend exposes a versioned REST API.

```
/api/v1/
```

Examples include:

```
GET    /trashbin
POST   /trashbin

GET    /devices
POST   /devices

GET    /trashbin-data
```

Interactive documentation is automatically generated by FastAPI.

```
http://localhost:8000/api/docs
```

---

# Local Development

## Requirements

* Python 3.11+
* PostgreSQL
* Docker
* UV (recommended)

---

## Installation

Clone the repository.

Create the environment file.

```
cp .env.example .env
```

Install dependencies.

```
uv sync
```

---

# Running the Backend

Start the API using Uvicorn.

```
uv run uvicorn app:app --reload
```

During startup the backend automatically:

* loads configuration
* configures logging
* runs Alembic migrations
* connects to PostgreSQL
* establishes the MQTT connection
* registers all routes

---

# Development Infrastructure

The infrastructure project provides PostgreSQL and supporting services.

Start it with Docker Compose.

```
cd ../../infrastructure

docker compose up -d
```

---

# Database Migrations

Apply pending migrations.

```
uv run alembic upgrade head
```

Create a migration.

```
uv run alembic revision --autogenerate -m "Description"
```

Rollback one migration.

```
uv run alembic downgrade -1
```

View migration history.

```
uv run alembic history
```

---

# Testing

Run all tests.

```
uv run pytest
```

Run with coverage.

```
uv run pytest --cov=. --cov-report html
```

---

# Logging

The backend provides structured logging.

Logging includes:

* startup information
* MQTT events
* database connections
* API requests
* warnings
* errors

Log files are automatically rotated to prevent unlimited growth.

---

# Adding a New Sensor

The backend is designed to support multiple sensor manufacturers.

Typical workflow:

1. Create a new sensor implementation inside `modules/sensors/`.
2. Implement payload decoding.
3. Register the sensor inside the Sensor Factory.
4. Test using simulated MQTT messages.
5. Verify measurements appear in the frontend.

No API changes are usually required.

---

# Troubleshooting

### Backend cannot connect to PostgreSQL

* Verify the database is running.
* Check the `.env` configuration.
* Ensure Docker services are started.

---

### MQTT connection fails

* Verify the MQTT broker is reachable.
* Check broker credentials.
* Confirm the configured topics exist.
* Ensure the broker accepts incoming client connections.

---

### API is unavailable

Verify the backend is running:

```
http://localhost:8000/api/health
```

If successful, the endpoint returns the current application status.

---

# Related Documentation

* Root Project Documentation: `../../README.md`
* Frontend Documentation: `../web/README.md`
* Infrastructure Documentation: `../../infrastructure/README.md`

---

# Contributing

Please keep the backend modular.

New functionality should follow the existing architecture by separating:

* routers
* services
* repositories
* models
* sensor implementations
* factories

This ensures the project remains maintainable as additional hardware and sensor types are integrated.
