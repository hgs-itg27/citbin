# CiTBIN Web Application

The CiTBIN Web Application is the primary user interface of the platform. It provides operators with a centralized dashboard for monitoring waste bins, managing devices, and viewing sensor data collected by the backend.

Built with **Next.js**, **React**, and **TypeScript**, the frontend communicates exclusively with the REST API exposed by the backend.

---

# Features

* Interactive dashboard
* Waste bin overview
* Device management
* Live sensor data visualization
* Responsive user interface
* REST API integration
* Modern React component architecture
* TypeScript support
* Tailwind CSS styling
* Dark mode support (if enabled)

---

# Technology Stack

| Component       | Technology   |
| --------------- | ------------ |
| Framework       | Next.js      |
| Language        | TypeScript   |
| UI Library      | React        |
| Styling         | Tailwind CSS |
| HTTP Client     | Fetch API    |
| Package Manager | npm          |

---

# Architecture

```text
                    FastAPI Backend
                           │
                      REST API
                           │
           ┌───────────────┴───────────────┐
           │                               │
      React Components               API Client
           │                               │
           └───────────────┬───────────────┘
                           │
                    Next.js Application
                           │
                     Browser Interface
```

The frontend contains no business logic regarding sensor processing. All sensor decoding, MQTT communication, and database interactions are handled by the backend.

---

# Project Structure

```text
apps/web/

├── app/
│   ├── dashboard/
│   ├── devices/
│   ├── trashbins/
│   ├── settings/
│   └── layout.tsx
│
├── components/
│   ├── ui/
│   ├── dashboard/
│   ├── trashbin/
│   └── device/
│
├── lib/
│
├── public/
│
├── styles/
│
├── utils/
│
└── package.json
```

---

# Application Structure

The application follows the Next.js App Router architecture.

Main areas include:

* Dashboard
* Waste Bin Management
* Device Management
* Settings
* Shared Components
* API Communication
* Utility Functions

---

# Dashboard

The dashboard provides an overview of the entire system.

Typical information includes:

* Total waste bins
* Active devices
* Current fill levels
* Recent measurements
* System status

The dashboard should provide users with the most important information at a glance.

---

# Waste Bin Management

The waste bin pages allow users to:

* View all waste bins
* Inspect individual bins
* View current fill level
* Display historical measurements
* Edit waste bin information
* Assign devices

---

# Device Management

The device section provides functionality for managing installed sensor devices.

Typical operations include:

* View registered devices
* Display device information
* Check battery status
* Assign devices to waste bins
* Remove inactive devices

---

# API Communication

The frontend communicates exclusively with the backend REST API.

Typical requests include:

```http
GET /api/v1/trashbin

GET /api/v1/device

GET /api/v1/trashbin-data

POST /api/v1/device
```

No direct database access exists within the frontend.

---

# Environment Variables

Create a local environment file.

```bash
cp .env.example .env.local
```

Typical configuration includes:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

---

# Installation

Install all dependencies.

```bash
npm install
```

or

```bash
npm ci
```

---

# Development

Start the development server.

```bash
npm run dev
```

Open the application in your browser.

```
http://localhost:3000
```

Hot reload is enabled by default.

---

# Production Build

Create an optimized production build.

```bash
npm run build
```

Start the production server.

```bash
npm run start
```

---

# Linting

Run ESLint.

```bash
npm run lint
```

Keeping the codebase lint-free ensures consistent formatting and improves maintainability.

---

# Component Architecture

The frontend follows a component-based architecture.

Components should:

* remain reusable
* avoid duplicated logic
* receive data via props
* separate presentation from business logic

Shared UI elements belong in the common component directory, while page-specific components should remain close to their respective pages.

---

# State Management

The application primarily relies on:

* React state
* React hooks
* API requests

Business logic should remain inside the backend whenever possible.

---

# Styling

Styling is implemented using Tailwind CSS.

Recommended practices:

* Use utility classes whenever possible.
* Keep components responsive.
* Avoid inline styles.
* Reuse shared UI components.

---

# Development Workflow

1. Start the infrastructure.
2. Start the backend API.
3. Start the frontend.
4. Verify API connectivity.
5. Implement UI changes.
6. Test responsive layouts.
7. Commit your changes.

---

# Troubleshooting

## Backend cannot be reached

Verify that the backend is running and accessible.

```
http://localhost:8000/api/docs
```

Also check the configured API URL in `.env.local`.

---

## Page does not update

Restart the development server.

```bash
npm run dev
```

Clear the browser cache if necessary.

---

## Build fails

Verify:

* Node.js version
* Installed dependencies
* Environment variables
* TypeScript errors

Run:

```bash
npm run lint

npm run build
```

---

# Related Documentation

* Root Documentation: `../../README.md`
* Backend Documentation: `../api/README.md`
* Infrastructure Documentation: `../../infrastructure/README.md`

---

# to the following class 12/3

* your main focus will be to upgrade/improve the web frontend
