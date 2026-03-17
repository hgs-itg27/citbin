from typing import Dict, Optional
import logging

# Initialize global variables for database and connection
db = None

# Dependency to get DB client
def get_dependencies() -> Dict:
    """
    Returns the database connection as dependencies.
    This function is used by FastAPI's dependency injection system.
    """
    return {"db": db}

def is_db_connected() -> bool:
    """Check if database connection is established"""
    return db is not None
