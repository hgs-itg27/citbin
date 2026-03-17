import os
import logging
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
        logging.error(f"Log file not found or is not a file at path: {log_file_path}. User: {username}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Log file not found on server.")

    logging.info(f"Admin user '{username}' initiated download of logs from {log_file_path}")
    return FileResponse(
        path=log_file_path,
        media_type='text/plain',
        filename=os.path.basename(log_file_path)
    )