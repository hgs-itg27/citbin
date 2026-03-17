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

    sensor[Sensor] -->|LoRaWAN| gateway[Gateway]
    gateway --> lns[LNS Network (Helium / IoT / TTS / …)]
    lns --> chirpstack[ChirpStack LNS]

    chirpstack <-->|HTTP Integration| backend[Backend]

    backend --> db[(PostgreSQL DB)]
    backend -->|REST API| frontend[Frontend]
```


## Erste Schritte

Detaillierte Anweisungen zur Installation, Konfiguration und zum Starten der einzelnen Komponenten finden Sie in den jeweiligen README-Dateien:

*   **Backend**: [apps/api/README.md](apps/api/README.md)
*   **Frontend**: [apps/web/README.md](apps/web/README.md)
*   **Simulator**: [apps/simulator/README.md](apps/simulator/README.md)
