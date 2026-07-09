# Projekt-Dokumentation für Anfänger

## Einleitung

Willkommen bei unserem Projekt! Diese Dokumentation hilft Ihnen, das Projekt auf Ihrem Computer zum Laufen zu bringen.

## Voraussetzungen

- Docker (für die Containerisierung)
- Git (für die Versionskontrolle)
- Ein Texteditor Ihrer Wahl (z.B. Visual Studio Code)

## Projekt aufsetzen

1. **Projekt klonen**:
   ```bash
   git clone https://github.com/ihre-benutzername/ihre-repo.git
   cd ihr-repo
   ```

2. **Docker-Container starten**:
   ```bash
   docker-compose -f infrastructure/docker-compose-develop.yml up -d
   ```

## Projektstruktur

- `apps/simulator/`: Der Simulator für die Mülleimer-Daten
- `apps/web/`: Die Webanwendung
- `apps/api/`: Die Backend-API
- `infrastructure/`: Docker-Konfigurationen
- `docs/`: Dokumentation

## Technologien

- **Python**: Für den Simulator und die API
- **Next.js**: Für die Webanwendung
- **Docker**: Für die Containerisierung
- **MQTT**: Für die Kommunikation zwischen den Komponenten
- **PostgreSQL**: Für die Datenbank

## Abhängigkeiten verwalten

Wir verwenden `uv` anstelle von `pip` für die Verwaltung der Python-Abhängigkeiten. `uv` ist schneller und effizienter als `pip`.

### Abhängigkeiten installieren

1. Navigieren Sie in das Verzeichnis der Anwendung (z.B. `apps/simulator/` oder `apps/api/`):
   ```bash
   cd apps/simulator/
   ```

2. Installieren Sie die Abhängigkeiten mit `uv`:
   ```bash
   uv pip install --system -r requirements.txt
   ```

### Neue Abhängigkeiten hinzufügen

1. Fügen Sie die neue Abhängigkeit zur `requirements.txt` Datei hinzu:
   ```bash
   echo "neue-abhängigkeit" >> requirements.txt
   ```

2. Installieren Sie die neue Abhängigkeit mit `uv`:
   ```bash
   uv pip install --system neue-abhängigkeit
   ```

## Docker verwenden

### Docker-Container starten

1. Navigieren Sie in das `infrastructure/` Verzeichnis:
   ```bash
   cd infrastructure/
   ```

2. Starten Sie die Docker-Container:
   ```bash
   docker-compose -f docker-compose-develop.yml up -d
   ```

### Docker-Container stoppen

1. Navigieren Sie in das `infrastructure/` Verzeichnis:
   ```bash
   cd infrastructure/
   ```

2. Stoppen Sie die Docker-Container:
   ```bash
   docker-compose -f docker-compose-develop.yml down
   ```

## Häufige Probleme

### Der Simulator startet nicht

1. Überprüfen Sie die Logs des Simulator-Containers:
   ```bash
   docker logs citbin-simulator
   ```

2. Stellen Sie sicher, dass der MQTT-Broker läuft:
   ```bash
   docker ps | grep mosquitto
   ```

3. Stellen Sie sicher, dass der Simulator im gleichen Netzwerk wie der MQTT-Broker ist:
   ```bash
   docker inspect citbin-simulator | grep Network
   ```

### Abhängigkeiten fehlen

1. Navigieren Sie in das Verzeichnis der Anwendung:
   ```bash
   cd apps/simulator/
   ```

2. Installieren Sie die Abhängigkeiten mit `uv`:
   ```bash
   uv pip install --system -r requirements.txt
   ```

## Fazit

Das ist alles! Sie sollten jetzt in der Lage sein, das Projekt auf Ihrem Computer zum Laufen zu bringen und zu verstehen, wie es funktioniert. Wenn Sie weitere Fragen haben, zögern Sie nicht, uns zu kontaktieren.