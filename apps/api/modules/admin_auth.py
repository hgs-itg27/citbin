import os
import secrets
import logging
from fastapi import APIRouter, Depends, HTTPException, status, Security
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi.responses import FileResponse

security = HTTPBasic()

# Fetch environment variables once when the module is loaded.
ADMIN_PASSWORD_ENV = os.getenv('ADMIN_PASSWORD')

def get_current_username(credentials: HTTPBasicCredentials = Security(security)):
    """
    Verifies HTTP Basic credentials.
    Compares the provided username and password against configured values.
    Uses secrets.compare_digest for timing attack resistance.
    """
    if not ADMIN_PASSWORD_ENV:
        logging.error("Admin password (ADMIN_PASSWORD) is not configured on the server. Access denied.")
        # Do not reveal that the password is not set to the client for security reasons.
        # Simply state authentication failed.
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed: Server configuration error.",
            headers={"WWW-Authenticate": "Basic"},
        )

    # Using a fixed username "admin". This could also be made configurable.
    correct_username_bytes = b"admin"
    current_username_bytes = credentials.username.encode("utf8")

    is_correct_username = secrets.compare_digest(
        current_username_bytes, correct_username_bytes
    )

    correct_password_bytes = ADMIN_PASSWORD_ENV.encode("utf8")
    current_password_bytes = credentials.password.encode("utf8")

    is_correct_password = secrets.compare_digest(
        current_password_bytes, correct_password_bytes
    )

    if not (is_correct_username and is_correct_password):
        logging.warning(f"Failed admin login attempt for username: {credentials.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username