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
                    logger.warning("Probleme mit der Migrationsdatenbank erkannt. Versuche Reset...")
                    reset_result = subprocess.run(
                        ["python", "reset_alembic.py"],
                        capture_output=True,
                        text=True
                    )
                    logging.debug("Reset-Ergebnis: %s", reset_result.stdout)
            except Exception as reset_error:
                logger.warning("Fehler beim Versuch, die Migration zurückzusetzen: %s", reset_error)
            
            # Alembic-Upgrade ausführen
            logger.info("Führe ausstehende Datenbankmigrationen aus...")
            result = subprocess.run(
                ["alembic", "upgrade", "head"],
                capture_output=True,
                text=True
            )
            
            if result.returncode == 0:
                logger.info("Migrationen erfolgreich ausgeführt")
                return True
            else:
                logger.error("Fehler bei der Ausführung der Migrationen: %s", result.stderr)
                return False

        finally:
            # Zurück zum ursprünglichen Verzeichnis wechseln
            os.chdir(original_dir)
            
    except Exception as e:
        logger.error("Unerwarteter Fehler bei der Ausführung der Migrationen: %s", str(e))
        return False
