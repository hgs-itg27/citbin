# CitBin – Einsteiger-Dokumentation

Willkommen beim **CitBin-Projekt**! Diese Dokumentation richtet sich an alle, die grundlegende Programmierkenntnisse haben, aber noch keine Erfahrung mit den eingesetzten Frameworks und Programmiersprachen besitzen. Hier findest du alles, was du brauchst, um das Projekt zu verstehen, aufzusetzen und mitzuarbeiten.

Du kannst dir auch die `README.md` Dateien in den einzelnen Unterordnern durchlesen.

---

## Inhaltsverzeichnis

1. [Was ist CitBin?](#1-was-ist-citbin)
2. [Technologien im Überblick](#2-technologien-im-überblick)
3. [Wie die Komponenten zusammenarbeiten](#3-wie-die-komponenten-zusammenarbeiten)
4. [Voraussetzungen installieren](#4-voraussetzungen-installieren)
5. [Projekt herunterladen](#5-projekt-herunterladen)
6. [Backend starten (Python / FastAPI)](#6-backend-starten-python--fastapi)
7. [Frontend starten (TypeScript / Next.js)](#7-frontend-starten-typescript--nextjs)
8. [Simulator starten](#8-simulator-starten)
9. [Projektstruktur verstehen](#9-projektstruktur-verstehen)
10. [Wichtige Konzepte erklärt](#10-wichtige-konzepte-erklärt)
11. [Häufige Entwicklungsaufgaben](#11-häufige-entwicklungsaufgaben)
12. [Tests ausführen](#12-tests-ausführen)
13. [Fehlersuche (Troubleshooting)](#13-fehlersuche-troubleshooting)
14. [Weiterführende Ressourcen](#weiterführende-ressourcen)

---

## Was ist CitBin?

CitBin ist ein **intelligentes Mülltonnen-Überwachungssystem**, das von der Klasse TG12/3 an der Hohentwiel Gewerbeschule Singen entwickelt wurde.

### Das Problem

Mülltonnen werden oft geleert, obwohl sie noch nicht voll sind – oder umgekehrt: Sie laufen über, weil niemand rechtzeitig Bescheid weiß. Das verschwendet Zeit, Geld und Kraftstoff.

### Die Lösung

Kleine **Sensoren** werden in Mülltonnen eingebaut. Diese Sensoren messen mit Ultraschall, wie voll die Tonne ist – ähnlich wie ein Einparksensor am Auto. Die Daten werden drahtlos übertragen. Das CitBin-System empfängt diese Daten, speichert sie in einer Datenbank und zeigt sie auf einer interaktiven Karte im Browser an.

### Das Ergebnis

Auf einem Dashboard sieht man auf einer Karte alle Mülltonnen mit ihrem aktuellen Füllstand, Batteriestatus und Standort. Die live-Anwendung ist erreichbar unter: **<https://citbin.sybit.education>**

---

## Technologien im Überblick

- **Python**: Für den Simulator und die API
- **FastAPI**: Python-Framework für das Backend
- **TypeScript**: Für die Webanwendung
- **Next.js**: Frontend-Framework
- **React**: Benutzeroberfläche in Komponenten
- **Docker**: Für die Containerisierung
- **MQTT**: Für die Kommunikation zwischen den Komponenten
- **PostgreSQL**: Für die Datenbank
- **SQLModel**: Für Datenbankmodelle
- **Alembic**: Für Datenbankmigrationen

---

## Wie die Komponenten zusammenarbeiten

```text
Sensor in der Mülltonne
        ↓
Basisstation
        ↓
Backend (FastAPI)
        ↓
PostgreSQL
        ↓
Frontend (Next.js)
        ↓
Browser / Dashboard
```

1. Der Sensor in der Mülltonne misst den Füllstand.
2. Die Daten werden über das Netzwerk an das Backend gesendet.
3. Das Backend verarbeitet und speichert die Daten in PostgreSQL.
4. Das Frontend fragt das Backend regelmäßig nach neuen Daten.
5. Der Benutzer sieht den aktuellen Füllstand im Browser.

---

## Voraussetzungen installieren

### Windows

```powershell
winget install -e --id Git.Git
winget install -e --id Python.Python.3
winget install -e --id OpenJS.NodeJS
winget install -e --id GitHub.cli
```

### Linux (Debian / Ubuntu)

```bash
sudo apt update
sudo apt install git python3 uv python3-venv nodejs npm -y
```

### Linux (Fedora)

```bash
sudo dnf install git python3 uv nodejs npm -y
```

### Linux (Arch)

```bash
sudo pacman -S git python uv nodejs npm 
```

### Installation prüfen

```bash
git --version
python --version
node --version
npm --version
```

---

## Projekt herunterladen

```bash
git clone https://github.com/hgs-itg27/citbin.git
cd citbin
```

---

## Backend starten (Python / FastAPI)

### Schritt 1: In den Backend-Ordner wechseln

```bash
cd apps/api
```

### Schritt 2: Virtuelle Umgebung erstellen

```bash
uv venv
```

Aktivieren:

```bash
# Windows:
venv\Scripts\activate

# Linux / macOS:
source venv/bin/activate
```

### Schritt 3: Abhängigkeiten installieren

```bash
uv sync
```

### Schritt 4: Umgebungsvariablen konfigurieren

```bash
copy .env.example .env
# oder
cp .env.example .env
```

### Schritt 5: Datenbank starten

```bash
cd ../../infrastructure
./update-development.sh
# oder unter Windows:
./update-development.bat
cd ../apps/api
```

### Schritt 6: Backend starten

```bash
python app.py
```

Das Backend läuft auf **http://localhost:8000**

Nützliche URLs:

- **API-Dokumentation:** http://localhost:8000/api/docs
- **Health-Check:** http://localhost:8000/api/health

---

## Frontend starten (TypeScript / Next.js)

### Schritt 1: In den Frontend-Ordner wechseln

```bash
cd apps/web
```

### Schritt 2: Abhängigkeiten installieren

```bash
npm install
```

### Schritt 3: Entwicklungsserver starten

```bash
npm run dev
```

Das Frontend ist erreichbar unter **http://localhost:3000**

---

## Simulator starten

> Der Simulator ist derzeit nicht auf einem aktuellen Stand weil wir echte Daten emfangen.

```bash
cd apps/simulator
uv sync
python app.py
```

### Simulator konfigurieren

| Variable | Beschreibung | Standardwert |
|----------|-------------|--------------|
| `DEVICE_NAME` | Name des simulierten Geräts | `Simulator-001` |
| `DEVICE_EUI` | Eindeutige Geräte-ID | zufällig generiert |
| `SLEEP_TIME` | Wartezeit zwischen Nachrichten (in Sekunden) | `5` |
| `BACKEND_API_URL` | URL des Backends | `http://localhost:8000` |

Beispiel:

```bash
SLEEP_TIME=10 DEVICE_NAME=MeinSensor python app.py
```

---

## Projektstruktur verstehen

```text
citbin/
├── apps/
│   ├── api/
│   ├── web/
│   └── simulator/
├── infrastructure/
├── docs/
└── README.md
```

### Backend im Detail (`apps/api/`)

```text
api/
├── app.py
├── dependencies.py
├── models/
├── routers/
├── modules/
├── migrations/
├── tests/
└── pyproject.toml
```

### Frontend im Detail (`apps/web/`)

```text
web/
├── app/
└── components/
```

---

## Wichtige Konzepte erklärt

### REST API

Eine REST API ist eine Schnittstelle, über die Programme über HTTP miteinander kommunizieren.

### JSON

JSON ist ein einfaches Textformat zum Austausch von Daten.

### Datenbankmodelle (SQLModel)

Python-Klassen beschreiben die Tabellen in der Datenbank.

### React-Komponenten

Die Benutzeroberfläche besteht aus wiederverwendbaren Komponenten.

### Umgebungsvariablen (.env)

Konfigurationswerte wie Passwörter werden außerhalb des Quellcodes gespeichert.

### Datenbankmigrationen (Alembic)

Änderungen am Datenbankschema werden versioniert verwaltet.

---

## Häufige Entwicklungsaufgaben

### Eine neue API-Route hinzufügen

```python
@router.get("/meine-route")
def meine_funktion():
    return {"nachricht": "Hallo Welt!"}
```

### Eine neue Frontend-Seite hinzufügen

```tsx
export default function MeineSeite() {
  return <h1>Hallo von meiner neuen Seite!</h1>;
}
```

### Datenbankmodell ändern

```python
beschreibung: str | None = None
```

### Änderungen mit Git speichern

```bash
git status
git add apps/api/routers/meine_datei.py
git commit -m "Neue Route für XY hinzugefügt"
git push
```

---

## Tests ausführen

```bash
cd apps/api
pytest -v tests/
pytest --cov=app tests/
pytest --cov=app tests/ --cov-report html
```

---

## Fehlersuche (Troubleshooting)

- `python` nicht gefunden: `python3` verwenden
- Backend startet nicht: Docker, `.env` und Datenbank prüfen
- Frontend zeigt keine Daten: Backend und `.env.local` prüfen
- `npm install` schlägt fehl: Cache leeren oder `node_modules` löschen
- Virtuelle Umgebung vergessen: `(venv)` prüfen
- Port bereits belegt: mit `lsof` oder `netstat` prüfen

---

## Weiterführende Ressourcen

- Python
- FastAPI
- SQLModel
- Next.js
- React
- TypeScript
- PostgreSQL
- Docker
- Git
- Alembic

*Letzte Aktualisierung: Juli 2026*
