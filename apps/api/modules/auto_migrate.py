import os
import logging
logger = logging.getLogger(__name__)
import subprocess
from pathlib import Path

def run_migrations():
    """
    Führt automatisch alle ausstehenden Alembic-Migrationen aus.
    Diese Funktion sollte beim Start der Anwendung aufgerufen werden.
    """
    try:
        # Pfad zum Backend-Verzeichnis
        backend_dir = Path(__file__).parent.parent.absolute()
        
        # Aktuelles Arbeitsverzeichnis speichern
        original_dir = os.getcwd()
        
        try:
            # In das Backend-Verzeichnis wechseln
            os.chdir(backend_dir)
            
            # Zuerst versuchen wir, die Datenbank zurückzusetzen, wenn es Probleme gibt
            try:
                # Prüfen, ob es Probleme mit der Migration gibt
                check_result = subprocess.run(
                    ["alembic", "current"],
                    capture_output=True,
                    text=True
                )
                
                if "Can't locate revision" in check_result.stderr or "DatatypeMismatch" in check_result.stderr:
                    logger.warning("Migration issues detected, attempting reset...")
                    reset_result = subprocess.run(
                        ["python", "reset_alembic.py"],
                        capture_output=True,
                        text=True
                    )
                    logger.info("Reset result: %s", reset_result.stdout)
            except Exception as reset_error:
                logger.warning("Error attempting migration reset: %s", reset_error)
            
            # Alembic-Upgrade ausführen
            logger.info("Running pending database migrations...")
            result = subprocess.run(
                ["alembic", "upgrade", "head"],
                capture_output=True,
                text=True
            )
            
            if result.returncode == 0:
                logger.info("Migrations executed successfully: %s", result.stdout)
                return True
            else:
                logger.error("Migration execution failed: %s", result.stderr)
                return False

        finally:
            # Zurück zum ursprünglichen Verzeichnis wechseln
            os.chdir(original_dir)
            
    except Exception as e:
        logger.error("Unexpected error running migrations: %s", str(e))
        return False
