import os
import logging
logger = logging.getLogger(__name__)
from fastapi import APIRouter, Depends, HTTPException, status, Security
from fastapi.responses import FileResponse
import modules.admin_auth as admin_auth

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)

APP_LOG_FILE_ENV = os.getenv('APP_LOG_FILE', 'logs/app.log')


@router.get("/logs", response_class=FileResponse)
def download_logs(username: str = Depends(admin_auth.get_current_username)):
    """
    Downloads the application log file.
    Requires admin authentication (HTTP Basic Auth).
    Username: admin
    Password: Value of ADMIN_PASSWORD environment variable.
    """
    log_file_path = APP_LOG_FILE_ENV
    if not os.path.exists(log_file_path) or not os.path.isfile(log_file_path):
        logger.error("Log file not found at path: %s (user: %s)", log_file_path, username)
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Log file not found on server.")

    logger.info("Admin user '%s' initiated download of logs from %s", username, log_file_path)
    return FileResponse(
        path=log_file_path,
        media_type='text/plain',
        filename=os.path.basename(log_file_path)
    )