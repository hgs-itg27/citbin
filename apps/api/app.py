from dotenv import load_dotenv
import os
from fastapi import FastAPI, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
import logging.handlers
import colorlog
from contextlib import asynccontextmanager
from modules import postgresql as postgres
from modules.auto_migrate import run_migrations
import uvicorn

# Setup API routes from modules
from fastapi import APIRouter
from dependencies import get_dependencies
from routers import devices, mioty, trashbin, trashbin_data, admin

load_dotenv()

# Configure logging
logger = colorlog.getLogger()  # Get root logger
logger.setLevel(logging.INFO)  # Set root logger level

# Remove any existing handlers to prevent duplicate logs
for handler in logger.handlers[:]:
    logger.removeHandler(handler)

# Console Handler
console_handler = colorlog.StreamHandler()
console_handler.setFormatter(
    colorlog.ColoredFormatter(
        "%(log_color)s%(asctime)s [%(levelname)s] %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
        log_colors={
            "DEBUG": "cyan",
            "INFO": "blue,bg_white",
            "WARNING": "yellow",
            "ERROR": "red",
            "CRITICAL": "bold_red,bg_white",
        },
    )
)
logger.addHandler(console_handler)

# Load config
APP_LOG_FILE = os.getenv("APP_LOG_FILE", "logs/app.log")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")

if not ADMIN_PASSWORD:
    logger.warning(
        "ADMIN_PASSWORD environment variable is not set. Log download endpoint will not be secure."
    )
    # In a production environment, you might want to raise an error or exit if the password is not set.

# Ensure log directory exists
# Create the directory if it does not exist, handling potential errors
log_dir = os.path.dirname(APP_LOG_FILE)
if log_dir and not os.path.exists(log_dir):  # Check if log_dir is not empty
    try:
        os.makedirs(log_dir)
        logger.info(f"Log directory created: {log_dir}")
    except OSError as e:
        logger.error(f"Error creating log directory {log_dir}: {e}")
elif not log_dir:  # Handle case where APP_LOG_FILE is just a filename like "app.log"
    logger.info(
        "Logging to current directory as no specific log directory is set in APP_LOG_FILE."
    )


# File Handler
try:
    file_handler = logging.handlers.RotatingFileHandler(
        APP_LOG_FILE,
        maxBytes=1 * 1024 * 1024,
        backupCount=5,
        encoding="utf-8",  # 1MB per file, 5 backups
    )
    file_handler.setFormatter(
        logging.Formatter(
            "%(asctime)s [%(levelname)s] [%(name)s:%(lineno)d] %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S",
        )
    )
    logger.addHandler(file_handler)
    logger.info(f"Logging to file: {APP_LOG_FILE}")
except Exception as e:
    logger.error(f"Failed to configure file logger for {APP_LOG_FILE}: {e}")


CONFIG = {
    "app_log_file": APP_LOG_FILE,
    "admin_password": ADMIN_PASSWORD,
    "postgresql": {
        "host": os.getenv("POSTGRES_HOST", "localhost"),
        "port": int(os.getenv("POSTGRES_PORT", 5432)),
        "username": os.getenv("POSTGRES_USER", "postgres"),
        "password": os.getenv("POSTGRES_PASSWORD", None),
        "database": os.getenv("POSTGRES_DB", "postgres"),
    },
}


# Define lifespan context manager
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup code - runs before the application starts
    import dependencies

    # Run database migrations
    try:
        migration_success = run_migrations()
        if migration_success:
            logging.info("Database migrations completed successfully.")
        else:
            logging.warning("Database migrations may not have completed successfully.")
    except Exception as e:
        logging.error(f"Error running database migrations: {e}")

    # Connect to PostgreSQL Database
    try:
        dependencies.db = postgres.connect(CONFIG["postgresql"])
        logging.info("Successfully connected to PostgreSQL database.")
    except Exception as e:
        logging.error(f"Failed to connect to PostgreSQL database: {e}")
        dependencies.db = None

    try:
        postgres.create_tables(dependencies.db)
        logging.info("Successfully created SQL tables.")
    except Exception as e:
        logging.error(f"Failed to create SQL tables: {e}")

    yield  # This is where the application runs

    # Shutdown code - runs when the application is shutting down
    logging.info("Application shutting down")


# Create FastAPI application
app = FastAPI(
    title="CiTBIN API",
    description="API for CiTBIN Backend Services",
    version="0.1.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
)

# Definiere die Origins (dein Frontend), die auf die API zugreifen dürfen.
origins = [
    "http://localhost",
    "http://localhost:3000",  # Standard-Port für Next.js
    "http://localhost:8000",  # Die API selbst
    "https://animated-fiesta-r4p775q6xjr7hpq54-8000.app.github.dev/",
    # Füge hier die URL deiner produktiven Frontend-Anwendung hinzu, z.B.:
    # "https://deine-domain.de"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],  # Erlaubt alle Methoden (GET, POST, DELETE etc.)
    allow_headers=["*"],  # Erlaubt alle Header
)


@app.get("/api/health", status_code=status.HTTP_200_OK)
def health_check():
    """
    Health check endpoint to verify database connection
    """
    from dependencies import is_db_connected

    db_connected = is_db_connected()

    if db_connected:
        return {"status": "ok", "database": "connected"}
    else:
        status_details = {
            "status": "error",
            "database": "connected" if db_connected else "disconnected",
            "message": "Database connection failed",
        }
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content=status_details
        )


# Create API router with prefix
api_router = APIRouter(prefix="/api/v1")


# Include routers
api_router.include_router(devices.router, dependencies=[Depends(get_dependencies)])
api_router.include_router(mioty.router, dependencies=[Depends(get_dependencies)])
api_router.include_router(trashbin.router, dependencies=[Depends(get_dependencies)])
api_router.include_router(
    trashbin_data.router, dependencies=[Depends(get_dependencies)]
)
api_router.include_router(
    admin.router,
    dependencies=[
        Depends(get_dependencies)
    ],  # Ensures DB dependencies are available if needed by admin routes
)

# Add the API router to the app
app.include_router(api_router)

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
