# CiTBIN

> Smart IoT waste monitoring platform powered by **mioty**, **MQTT**, **FastAPI**, and **Next.js**.

![Python](https://img.shields.io/badge/Python-3.11+-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688)
![Next.js](https://img.shields.io/badge/Next.js-Frontend-black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED)
![MQTT](https://img.shields.io/badge/MQTT-IoT-orange)
![mioty](https://img.shields.io/badge/mioty-LPWAN-green)

---

# Overview

CiTBIN is an IoT platform for monitoring public waste bins using wireless sensors. Sensor data is transmitted through a **mioty** network, forwarded via **MQTT**, processed by a **FastAPI** backend, stored in **PostgreSQL**, and visualized through a modern **Next.js** web application.

The project was developed as part of an initiative at the **Hohentwiel Gewerbeschule Singen**.

The project will be published under the following adress: https://citbin.sybit.education

Its modular architecture allows developers to easily integrate new sensor types, waste bin models, and visualization features while keeping the system maintainable and scalable.

---

# Features

* Real-time waste bin monitoring
* mioty sensor integration
* MQTT-based communication
* Automatic payload decoding
* Device management
* Historical measurement storage
* Interactive web dashboard
* REST API
* Automatic database migrations
* Docker development environment
* Sensor simulator
* Extensible architecture for additional sensor types

---

# Architecture

```text
                  +----------------------+
                  |   mioty Sensors      |
                  +----------+-----------+
                             |
                      mioty Network
                             |
                             v
                    MQTT Message Broker
                             |
                             v
                  +----------------------+
                  |   FastAPI Backend    |
                  | MQTT Client & Parser |
                  +----------+-----------+
                             |
                 Payload Processing Engine
                             |
              +--------------+--------------+
              |                             |
              v                             v
      PostgreSQL Database            REST API
                                            |
                                            |
                                            v
                                 Next.js Web Frontend
```

---

# How It Works

The complete data flow is illustrated below.

1. A mioty sensor periodically measures the fill level of a waste bin.
2. The measurement is transmitted over the mioty network.
3. The network forwards the payload to an MQTT broker.
4. The backend subscribes to the configured MQTT topics.
5. Incoming payloads are decoded.
6. The correct sensor implementation processes the payload.
7. Device information is validated.
8. Measurements are stored inside PostgreSQL.
9. The REST API exposes the processed data.
10. The web frontend visualizes the latest information.

---

# Repository Structure

```text
citbin/

├── apps/
│   ├── api/
│   │   ├── api/
│   │   ├── routers/
│   │   ├── models/
│   │   ├── modules/
│   │   ├── migrations/
│   │   └── tests/
│   │
│   ├── web/
│   │   ├── app/
│   │   ├── components/
│   │   ├── utils/
│   │   └── styles/
│   │
│   └── simulator/
│
├── infrastructure/
│
├── docs/
│
└── README.md
```

---

# Project Components

## Backend (`apps/api`)

The backend is built with **FastAPI** and is responsible for all business logic.

Responsibilities include:

* MQTT communication
* Payload decoding
* Device management
* Waste bin management
* Database access
* REST API
* Automatic migrations
* Sensor abstraction
* Logging

More information can be found in:

```text
apps/api/README.md
```

---

## Frontend (`apps/web`)

The frontend is developed using **Next.js**, **React**, and **TypeScript**.

It provides:

* Interactive dashboard
* Waste bin overview
* Administrative tools
* Device management
* Live status information
* Responsive design

Documentation:

```text
apps/web/README.md
```

---

## Infrastructure

The infrastructure directory contains everything required for local development and deployment.

Included services:

* PostgreSQL
* Docker Compose
* Environment configuration

Documentation:

```text
infrastructure/README.md
```

---

## Simulator

The simulator generates artificial sensor payloads for development and testing.

It enables backend development without requiring physical mioty hardware.

---

# Technology Stack

## Backend

* Python 3.11+
* FastAPI
* SQLModel
* SQLAlchemy
* Alembic
* PostgreSQL
* Uvicorn
* Paho MQTT

## Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

## Infrastructure

* Docker
* Docker Compose

## Communication

* MQTT
* REST API
* HTTP
* JSON

---

# Getting Started

## Requirements

Install the following software before starting development.

| Software | Version     |
| -------- | ----------- |
| Python   | 3.11+       |
| Node.js  | 20+         |
| Docker   | Latest      |
| Git      | Latest      |
| UV       | Recommended |

---

# Clone the Repository

```bash
git clone https://github.com/your-organization/citbin.git

cd citbin
```

---

# Start the Infrastructure

```bash
cd infrastructure

docker compose up -d
```

This starts the required services, including PostgreSQL.

---

# Start the Backend

```bash
cd apps/api

cp .env.example .env

uv sync

uv run uvicorn app:app --reload
```

The backend automatically:

* connects to PostgreSQL
* executes pending database migrations
* connects to the MQTT broker
* subscribes to configured topics
* starts the REST API

API documentation:

```
http://localhost:8000/api/docs
```

---

# Start the Frontend

```bash
cd apps/web

npm install

npm run dev
```

Open:

```
http://localhost:3000
```

---

# Development Workflow

Typical workflow:

1. Start Docker services.
2. Start the backend.
3. Start the frontend.
4. Connect a simulator or real mioty sensor.
5. Verify incoming MQTT messages.
6. Observe decoded measurements.
7. Check the web dashboard.

---

# Environment Variables

Each application contains a `.env.example`.

Copy it before running the application.

```bash
cp .env.example .env
```

---

# Database Migrations

Apply migrations:

```bash
uv run alembic upgrade head
```

Create a migration:

```bash
uv run alembic revision --autogenerate -m "Description"
```

Rollback:

```bash
uv run alembic downgrade -1
```

---

# Documentation

Additional documentation is available in the `docs/` directory, including project organization, software development, hardware integration, operational notes, and meeting protocols.

---

# Acknowledgements

CiTBIN combines modern web technologies with low-power IoT communication to demonstrate a scalable smart-city solution for waste management.

Core technologies include:

* FastAPI
* Next.js
* PostgreSQL
* Docker
* MQTT
* mioty
* SQLModel
* Alembic
