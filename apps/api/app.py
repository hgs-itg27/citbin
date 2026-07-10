import logging
import os
import uuid
from contextlib import asynccontextmanager

import uvicorn
from dotenv import load_dotenv

# Setup API routes from modules
from fastapi import APIRouter, Depends, FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

from dependencies import get_dependencies
from logging_config import configure_logging, request_id_var
from modules import postgresql as postgres
from modules.auto_migrate import run_migrations
from routers import admin, devices, trashbin, trashbin_data

load_dotenv()

# ---------------------------------------------------------------------------
# Logging Configuration
# ---------------------------------------------------------------------------

configure_logging()
logger = logging.getLogger(__name__)


class _RequestIDMiddleware(BaseHTTPMiddleware):
    """Inject or propagate a request ID via ContextVar for log correlation."""

    async def dispatch(self, request: Request, call_next):
        request_id = request.headers.get("X-Request-ID") or str(uuid.uuid4())[:8]
        token = request_id_var.set(request_id)
        try:
            response = await call_next(request)
            response.headers["X-Request-ID"] = request_id
            return response
        finally:
            request_id_var.reset(token)


# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

CONFIG = {
    "postgresql": {
        "host": os.getenv("POSTGRES_HOST", "localhost"),
        "port": int(os.getenv("POSTGRES_PORT", 5432)),
        "username": os.getenv("POSTGRES_USER", "postgres"),
        "password": os.getenv("POSTGRES_PASSWORD"),
        "database": os.getenv("POSTGRES_DB", "postgres"),
    },
}

ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")
if not ADMIN_PASSWORD:
    logger.warning("ADMIN_PASSWORD env var is not set. Log download endpoint will not be secure.")


# ---------------------------------------------------------------------------
# Lifespan (startup / shutdown)
# ---------------------------------------------------------------------------


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    import dependencies
    from api import mioty_service

    # Run database migrations
    try:
        migration_success = run_migrations()
        if migration_success:
            logging.info("Database migrations completed successfully.")
        else:
            logging.warning("Database migrations may not have completed successfully.")
    except Exception as e:
        logging.error("Error running database migrations: %s", e)

    # Connect to PostgreSQL
    try:
        dependencies.db = postgres.connect(CONFIG["postgresql"])
        logging.info("Connected to PostgreSQL database.")
    except Exception as e:
        logging.error("Failed to connect to PostgreSQL database: %s", e)
        dependencies.db = None

    try:
        postgres.create_tables(dependencies.db)
        logging.info("SQL tables created.")
    except Exception as e:
        logging.error("Failed to create SQL tables: %s", e)

    try:
        mioty_service.create()
        logging.info("Connected to MQTT broker.")
    except Exception as e:
        logging.error("Failed to connect to MQTT broker: %s", e)

    yield  # Application runs here

    # Shutdown
    logging.info("Application shutting down")


# ---------------------------------------------------------------------------
# FastAPI application
# ---------------------------------------------------------------------------

app = FastAPI(
    title="CiTBIN API",
    description="API for CiTBIN Backend Services",
    version="0.1.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
)

# Middleware — request ID must run early so downstream code can access it
app.add_middleware(_RequestIDMiddleware)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------


@app.get("/api/health", status_code=status.HTTP_200_OK)
def health_check():
    """Health check endpoint that also verifies database connectivity."""
    from dependencies import is_db_connected

    db_connected = is_db_connected()
    if db_connected:
        return {"status": "ok", "database": "connected"}

    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "status": "error",
            "database": "disconnected",
            "message": "Database connection failed",
        },
    )


# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(devices.router, dependencies=[Depends(get_dependencies)])
api_router.include_router(trashbin.router, dependencies=[Depends(get_dependencies)])
api_router.include_router(trashbin_data.router, dependencies=[Depends(get_dependencies)])
api_router.include_router(admin.router, dependencies=[Depends(get_dependencies)])

app.include_router(api_router)

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
