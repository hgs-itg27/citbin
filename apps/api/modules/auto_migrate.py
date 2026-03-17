import os
import logging
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
                    logging.warning("Probleme mit der Migrationsdatenbank erkannt. Versuche Reset...")
                    reset_result = subprocess.run(
                        ["python", "reset_alembic.py"],
                        capture_output=True,
                        text=True
                    )
                    logging.info(f"Reset-Ergebnis: {reset_result.stdout}")
            except Exception as reset_error:
                logging.warning(f"Fehler beim Versuch, die Migration zurückzusetzen: {reset_error}")
            
            # Alembic-Upgrade ausführen
            logging.info("Führe ausstehende Datenbankmigrationen aus...")
            result = subprocess.run(
                ["alembic", "upgrade", "head"],
                capture_output=True,
                text=True
            )
            
            if result.returncode == 0:
                logging.info(f"Migrationen erfolgreich ausgeführt: {result.stdout}")
                return True
            else:
                logging.error(f"Fehler bei der Ausführung der Migrationen: {result.stderr}")
                return False
            
        finally:
            # Zurück zum ursprünglichen Verzeichnis wechseln
            os.chdir(original_dir)
            
    except Exception as e:
        logging.error(f"Unerwarteter Fehler bei der Ausführung der Migrationen: {str(e)}")
        return False
