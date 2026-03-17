import pytest
from fastapi.testclient import TestClient
import logging
from sqlmodel import SQLModel, create_engine, Session
from sqlalchemy.pool import StaticPool

# Disable excessive logging during tests
logging.basicConfig(level=logging.WARNING)

# Create in-memory SQLite database for tests
@pytest.fixture(scope="function")
def in_memory_db():
    """
    Creates an in-memory SQLite database for tests.
    
    Returns:
        Session: A SQLModel session connected to the in-memory database.
    """
    # Create in-memory SQLite database with thread-local connections
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool  # Ensures connections are reused within the same thread
    )
    
    # Create all tables in the in-memory database
    SQLModel.metadata.create_all(engine)
    
    # Create a session to interact with the database
    with Session(engine) as session:
        yield session

# Mock the database connection before importing the app
@pytest.fixture(autouse=True)
def mock_connections(mocker, in_memory_db):
    """
    Mocks the database connection for all tests.
    This fixture runs automatically for all tests.
    """
    # Use the in-memory database session instead of a mock
    # Patch database connection to return our in-memory db
    mocker.patch('modules.postgresql.connect', return_value=in_memory_db)
    
    # Patch database create_tables (not needed since we create tables in in_memory_db fixture)
    mocker.patch('modules.postgresql.create_tables', return_value=None)
    
    # Patch migrations
    mocker.patch('modules.auto_migrate.run_migrations', return_value=True)
    
    # Patch the dependency functions to return True for health checks
    mocker.patch('dependencies.is_db_connected', return_value=True)

# Now it's safe to import the app
import os
os.environ['ADMIN_PASSWORD'] = 'test'  # Set admin password for tests
from app import app as fastapi_app

@pytest.fixture(scope="function")
def client():
    """
    A test client for the FastAPI application.
    Using function scope to ensure clean state for each test.
    
    Returns:
        TestClient: A client that can be used to make requests to the FastAPI app.
    """
    # Use FastAPI's TestClient which is compatible with the versions we're using
    from fastapi.testclient import TestClient
    from requests.auth import HTTPBasicAuth
    client = TestClient(fastapi_app)
    client.auth = HTTPBasicAuth(username=b"admin", password=b"test")
    return client
