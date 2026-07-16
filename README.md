# Projekt CitBin

Das CiTBIN (CITIOT) ist ein Projekt der Klasse TG12/3 an der Hohentwiel Gewerbeschule Singen.

Die Anwendung wird unter folgender Adresse veröffentlicht: https://citbin.sybit.education

## Übersicht

Das Projekt besteht aus den folgenden Hauptkomponenten:

1.  **Backend API (`apps/api`)**:
    *   Basiert auf Python und dem FastAPI Framework.
    *   Stellt eine REST-API zur Verwaltung von Geräten, Mülltonnen und Sensordaten bereit.
    *   Verwendet PostgreSQL mit SQLModel für die Datenpersistenz.
    *   Emfpängt die Daten per HTTP Uplink vom ChirpStack LNS.
    *   Verarbeitet eingehende Daten (z.B. vom Helium-Netzwerk).

2.  **Web-Frontend (`apps/web`)**:
    *   Entwickelt mit Next.js (React Framework) und TypeScript.
    *   Bietet eine Weboberfläche zur Visualisierung der Mülltonnen-Standorte und -Füllstände auf einer Karte.
    *   Ermöglicht die Verwaltung der registrierten Geräte.
    *   Nutzt die vom Backend bereitgestellte API.

3.  **Simulator (`apps/simulator`)**:
    *   Ein Python-Skript, das das Verhalten eines echten IoT-Geräts simuliert.
    *   Sendet periodisch Testdaten per Uplink an das Backend.
    *   Nützlich für Entwicklungs- und Testzwecke ohne physische Hardware.

## Verzeichnisstruktur


```sh
    citbin/
    ├── apps/
    │   ├── web/       # Next.js Frontend Anwendung
    │   ├── api/       # FastAPI Backend Anwendung
    │   └── simulator/ # Daten Simulator
    ├── docs/
    │   ├── 00-Organisation/
    │   ├── 01-Betrieb/
    │   ├── 02-Hardware/
    │   ├── 03-Software/
    │   ├── 04-Projektleitung/
    │   ├── 05-Gemeinsam/
    │   └── 06-Abgaben/
    ├── infrastructure/
    ├── scripts/
    ├── package.json
    ├── bun.lockb
    ├── bunfig.toml
    ├── pyproject.toml
    ├── docker-compose.yml
    └── Makefile
```


## Infrastruktur Diagramm

![image](https://github.com/user-attachments/assets/4c83982c-f269-495b-9776-f7cf73b5d7c4)

```mermaid
flowchart LR
 
    sensor[Sensor] -->|LoRaWAN| BaseStationHGS[BaseStationHGS]
    BaseStationHGS --> lns["LNS Network - Helium / IoT / TTS"]
    lns --> BaseStationSybit["BaseStationSybit"]
 
    BaseStationSybit <-->|HTTP Integration| backend[Backend]
 
    backend --> db[(PostgreSQL DB)]
    backend -->|REST API| frontend[Frontend]
```


## Paketverwaltung mit UV

Das Projekt verwendet [UV](https://github.com/astral-sh/uv) als modernen Python-Paketmanager (alternativ zu pip).

### Installation von UV

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
# oder
pip install uv
```

### Grundlegende Befehle

```bash
# Dependencies installieren
cd apps/api && uv sync

# Mit Dev-Dependencies
cd apps/api && uv sync --dev

# Paket hinzufügen
cd apps/api && uv add requests

# Paket zu Dev-Dependencies hinzufügen
cd apps/api && uv add --dev pytest

# Paket entfernen
cd apps/api && uv remove requests

# Virtual Environment erstellen (falls nicht vorhanden)
cd apps/api && uv venv

# App innerhalb der Umgebung ausführen
cd apps/api && uv run uvicorn app:app --reload

# App testen
cd apps/api && uv run pytest

# Lock-Datei aktualisieren
cd apps/api && uv lock
```

### Warum UV?

- **Schnell**: Bis zu 10-100x schneller als pip
- **Zuverlässig**: Reproduzierbare Builds mit `uv.lock`
- **Einfach**: Ein einziges Tool für Virtual Environments, Dependencies und Scripts

## Erste Schritte

Eine **umfassende Einsteiger-Dokumentation** mit Erklärungen zu allen Technologien, einer Schritt-für-Schritt-Installationsanleitung und wichtigen Konzepten findest du hier:

*   📖 **[Einsteiger-Dokumentation](docs/05-Gemeinsam/Einstieg.md)**

Detaillierte Anweisungen zur Installation, Konfiguration und zum Starten der einzelnen Komponenten finden Sie in den jeweiligen README-Dateien:

*   **Backend**: [apps/api/README.md](apps/api/README.md)
*   **Frontend**: [apps/web/README.md](apps/web/README.md)
*   **Simulator**: [apps/simulator/README.md](apps/simulator/README.md)
