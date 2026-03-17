# CitBin – Einsteiger-Dokumentation

Willkommen beim **CitBin-Projekt**! Diese Dokumentation richtet sich an alle, die grundlegende Programmierkenntnisse haben, aber noch keine Erfahrung mit den eingesetzten Frameworks und Programmiersprachen besitzen. Hier findest du alles, was du brauchst, um das Projekt zu verstehen, aufzusetzen und mitzuarbeiten.

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

---

## 1. Was ist CitBin?

CitBin ist ein **intelligentes Mülltonnen-Überwachungssystem**, das von der Klasse TG12/3 an der Hohentwiel Gewerbeschule Singen entwickelt wurde.

### Das Problem

Mülltonnen werden oft geleert, obwohl sie noch nicht voll sind – oder umgekehrt: Sie laufen über, weil niemand rechtzeitig Bescheid weiß. Das verschwendet Zeit, Geld und Kraftstoff.

### Die Lösung

Kleine **Sensoren** werden in Mülltonnen eingebaut. Diese Sensoren messen mit Ultraschall, wie voll die Tonne ist – ähnlich wie ein Einparksensor am Auto. Die Daten werden drahtlos über **LoRaWAN** (ein energiesparendes Funknetz für IoT-Geräte) übertragen. Das CitBin-System empfängt diese Daten, speichert sie in einer Datenbank und zeigt sie auf einer interaktiven Karte im Browser an.

### Das Ergebnis

Auf einem Dashboard sieht man auf einer Karte alle Mülltonnen mit ihrem aktuellen Füllstand, Batteriestatus und Standort. Die live-Anwendung ist erreichbar unter: **https://citbin.sybit.education**

---

## 2. Technologien im Überblick

Das Projekt besteht aus mehreren Teilen, die unterschiedliche Technologien verwenden.

### 🐍 Python & FastAPI (Backend)

**Python** ist eine weit verbreitete Programmiersprache, die für ihre einfache, lesbare Syntax bekannt ist. Sie wird oft für Server-Anwendungen, Datenanalyse und automatisierte Skripte eingesetzt.

**FastAPI** ist ein Python-Framework, das das Erstellen von Web-APIs (Schnittstellen, über die Programme miteinander kommunizieren) sehr einfach macht. Es generiert automatisch eine interaktive Dokumentation aller Endpunkte.

> **Analogie:** Stell dir das Backend wie das Herzstück eines Restaurants vor – die Küche. Es nimmt Bestellungen (Anfragen) entgegen, verarbeitet sie und schickt die fertigen Gerichte (Antworten) zurück.

**Was das Backend macht:**
- Empfängt Sensordaten von IoT-Geräten
- Speichert Daten in der Datenbank
- Stellt Daten für das Frontend bereit
- Verwaltet Mülltonnen und Geräte

### 🌐 TypeScript & Next.js (Frontend)

**TypeScript** ist eine Erweiterung von JavaScript (der Sprache, die im Browser läuft), die zusätzlich Datentypen kennt. Das hilft, Fehler früh zu finden und den Code besser zu verstehen.

**Next.js** ist ein Framework basierend auf **React**, mit dem man moderne Webseiten baut. React erlaubt es, die Benutzeroberfläche in wiederverwendbare Bausteine (sogenannte „Komponenten") aufzuteilen.

> **Analogie:** Das Frontend ist das, was der Gast im Restaurant sieht – das Speiselokal, die Speisekarte, die Tische. Es kommuniziert mit dem Backend (der Küche), um aktuelle Informationen anzuzeigen.

**Was das Frontend macht:**
- Zeigt alle Mülltonnen auf einer interaktiven Karte an
- Visualisiert Füllstand, Batteriestand und Standort
- Bietet eine Admin-Oberfläche zur Verwaltung
- Funktioniert im Browser ohne Installation

### 🗄️ PostgreSQL (Datenbank)

**PostgreSQL** ist ein leistungsstarkes, quelloffenes Datenbanksystem. Daten werden in Tabellen gespeichert – ähnlich wie in Excel-Tabellen, aber viel leistungsfähiger und für große Datenmengen geeignet.

**SQLModel** ist eine Python-Bibliothek, die den Umgang mit der Datenbank vereinfacht: Statt SQL-Befehle direkt zu schreiben, arbeitet man mit Python-Klassen (sogenannten „Modellen").

### 🐳 Docker (Infrastruktur)

**Docker** ist ein Werkzeug, das Anwendungen in abgeschlossene „Container" verpackt. Ein Container enthält alles, was eine Anwendung zum Laufen braucht – ähnlich wie ein Versandpaket, das alle Teile enthält und überall gleich aussieht, egal auf welchem Computer er geöffnet wird.

**Docker Compose** erlaubt es, mehrere Container gemeinsam zu starten und zu verwalten.

### 📡 LoRaWAN & ChirpStack (IoT)

**LoRaWAN** (Long Range Wide Area Network) ist ein drahtloses Kommunikationsprotokoll speziell für IoT-Geräte (Internet of Things – vernetzte Alltagsgegenstände). Es überträgt kleine Datenpakete über weite Strecken bei sehr geringem Energieverbrauch – ideal für batteriebetriebene Sensoren.

**ChirpStack** ist ein quelloffener LoRaWAN-Netzwerkserver, der die Funkkommunikation zwischen Sensoren und Backend vermittelt.

---

## 3. Wie die Komponenten zusammenarbeiten

```
┌─────────────────────────────────────────────────────────────────┐
│                        Gesamtübersicht                          │
└─────────────────────────────────────────────────────────────────┘

  📡 Sensor           📻 Gateway          🌐 Netzwerk
  (in der Mülltonne)  (im Freien)         (Helium / ChirpStack)
       │                   │                      │
       │   LoRaWAN Funk    │   Internet           │
       └──────────────────>│─────────────────────>│
                                                  │
                                     HTTP Anfrage │
                                                  ▼
                                    ┌─────────────────────┐
                                    │   Backend (FastAPI)  │
                                    │   Python             │
                                    │   Port 8000          │
                                    └──────────┬──────────┘
                                               │
                                    ┌──────────▼──────────┐
                                    │  Datenbank           │
                                    │  PostgreSQL          │
                                    └──────────┬──────────┘
                                               │
                                    REST API   │
                                               ▼
                                    ┌─────────────────────┐
                                    │  Frontend (Next.js)  │
                                    │  TypeScript/React    │
                                    │  Port 3000           │
                                    └─────────────────────┘
                                               │
                                               │  Browser
                                               ▼
                                    👤 Benutzer (Karte im Browser)
```

**Schritt-für-Schritt-Ablauf:**
1. Der Sensor in der Mülltonne misst den Abstand zur Oberfläche des Mülls
2. Das Messergebnis wird per LoRaWAN zum Gateway gesendet
3. Das Gateway leitet die Daten über das Internet zu ChirpStack weiter
4. ChirpStack sendet die Daten per HTTP-Anfrage (sogenannter „Uplink") an das Backend
5. Das Backend verarbeitet die Daten und speichert sie in PostgreSQL
6. Das Frontend fragt das Backend regelmäßig nach neuen Daten
7. Der Benutzer sieht den aktuellen Füllstand auf der Karte im Browser

---

## 4. Voraussetzungen installieren

Bevor du anfangen kannst, musst du einige Programme auf deinem Computer installieren.

### 🪟 Windows

Öffne die **PowerShell** (Rechtsklick auf das Windows-Symbol → „Windows PowerShell") und führe folgende Befehle aus:

**Git installieren** (zum Herunterladen und Verwalten des Quellcodes):
```powershell
winget install -e --id Git.Git
```

**Python installieren** (für das Backend und den Simulator):
```powershell
winget install -e --id Python.Python.3
```

**Node.js installieren** (für das Frontend):
```powershell
winget install -e --id OpenJS.NodeJS
```

**GitHub CLI installieren** (optional, vereinfacht GitHub-Anmeldung):
```powershell
winget install -e --id GitHub.cli
```

> ⚠️ **Wichtig:** Nach der Installation ein neues Terminal-Fenster öffnen, damit die Installationen erkannt werden!

### 🐧 Linux (Debian / Ubuntu)

```bash
# Paketquellen aktualisieren
sudo apt update

# Git installieren
sudo apt install git -y

# Python installieren
sudo apt install python3 python3-pip python3-venv -y

# Node.js installieren
sudo apt install nodejs npm -y
```

### 🎩 Linux (Fedora)

```bash
# Git installieren
sudo dnf install git -y

# Python installieren
sudo dnf install python3 python3-pip -y

# Node.js installieren
sudo dnf install nodejs npm -y
```

### Installation prüfen

Überprüfe, ob alles korrekt installiert wurde:

```bash
git --version        # Erwartet: git version 2.x.x
python --version     # Erwartet: Python 3.x.x  (oder: python3 --version)
node --version       # Erwartet: v20.x.x oder ähnlich
npm --version        # Erwartet: 10.x.x oder ähnlich
```

---

## 5. Projekt herunterladen

Das Projekt wird mit **Git** heruntergeladen (man spricht vom „Klonen" des Repositories).

```bash
# Repository klonen (herunterladen)
git clone https://github.com/hgs-itg27/citbin.git

# In das Projektverzeichnis wechseln
cd citbin
```

> **Was ist ein Repository?** Ein Repository (kurz: Repo) ist ein Ordner, in dem der gesamte Quellcode des Projekts gespeichert wird. Git merkt sich alle Änderungen und erlaubt es, zu früheren Versionen zurückzukehren.

---

## 6. Backend starten (Python / FastAPI)

Das Backend ist die Server-Anwendung, die Daten empfängt, verarbeitet und bereitstellt.

### Schritt 1: In den Backend-Ordner wechseln

```bash
cd apps/api
```

### Schritt 2: Virtuelle Umgebung erstellen

Eine **virtuelle Umgebung** (Virtual Environment, kurz `venv`) ist ein abgetrennter Bereich auf deinem Computer, in dem Python-Pakete installiert werden – ohne andere Projekte zu beeinflussen.

```bash
# Virtuelle Umgebung erstellen
python -m venv venv

# Virtuelle Umgebung aktivieren
# Windows:
venv\Scripts\activate
# Linux / macOS:
source venv/bin/activate
```

> Nach der Aktivierung siehst du `(venv)` am Anfang deiner Eingabezeile. Das zeigt, dass die virtuelle Umgebung aktiv ist.

### Schritt 3: Abhängigkeiten installieren

**Abhängigkeiten** (Dependencies) sind externe Bibliotheken und Pakete, die das Projekt benötigt. Alle notwendigen Pakete sind in der Datei `requirements.txt` aufgelistet.

```bash
pip install -r requirements.txt
```

> `pip` ist der Paketmanager von Python – ähnlich wie ein App-Store für Python-Bibliotheken.

### Schritt 4: Umgebungsvariablen konfigurieren

Das Backend benötigt Konfigurationsdaten (z.B. Datenbankverbindung, Passwörter). Diese werden als **Umgebungsvariablen** in einer `.env`-Datei gespeichert (der Punkt am Anfang des Namens ist Absicht).

```bash
# Beispieldatei kopieren
# Windows:
copy .env.example .env
# Linux / macOS:
cp .env.example .env
```

Öffne die erstellte `.env`-Datei in einem Texteditor und passe ggf. die Werte an:

```dotenv
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=citbin
POSTGRES_USER=citbin
POSTGRES_PASSWORD=citbin2025!
ADMIN_PASSWORD=citbin2025!
```

> ⚠️ Die `.env`-Datei enthält Passwörter und sensible Daten. Sie ist in `.gitignore` eingetragen und wird **nicht** zu GitHub hochgeladen.

### Schritt 5: Datenbank starten (mit Docker)

Das Backend benötigt eine PostgreSQL-Datenbank. Am einfachsten startet man sie über Docker:

```bash
# In das infrastructure-Verzeichnis wechseln
cd ../../infrastructure

# Entwicklungsinfrastruktur starten
# Windows:
./update-development.bat
# Linux / macOS:
./update-development.sh

# Zurück zum Backend
cd ../apps/api
```

> Falls du kein Docker verwendest, kannst du PostgreSQL auch direkt installieren. Das ist jedoch aufwendiger und wird hier nicht beschrieben.

### Schritt 6: Backend starten

```bash
python app.py
```

Du solltest folgende Ausgabe sehen:

```
INFO: Started server process [...]
INFO: Uvicorn running on http://0.0.0.0:8000
```

Das Backend läuft jetzt auf **http://localhost:8000**

**Nützliche URLs:**
- **API-Dokumentation (Swagger UI):** http://localhost:8000/api/docs  
  Hier kannst du alle verfügbaren Endpunkte interaktiv ausprobieren!
- **Health-Check:** http://localhost:8000/api/health

---

## 7. Frontend starten (TypeScript / Next.js)

Das Frontend ist die Weboberfläche, die im Browser läuft.

### Schritt 1: In den Frontend-Ordner wechseln

**Öffne ein neues Terminal** (das Backend soll weiter laufen) und wechsle in das Frontend-Verzeichnis:

```bash
cd apps/web
```

### Schritt 2: Abhängigkeiten installieren

```bash
npm install
```

> `npm` (Node Package Manager) ist der Paketmanager von Node.js – ähnlich wie `pip` für Python. Die `package.json` listet alle benötigten Pakete auf.

### Schritt 3: Entwicklungsserver starten

```bash
npm run dev
```

Du solltest folgende Ausgabe sehen:

```
▲ Next.js 15.x.x
- Local:        http://localhost:3000
```

Das Frontend ist jetzt erreichbar unter **http://localhost:3000**

> **Entwicklungsserver vs. Produktionsserver:** Der Entwicklungsserver (`npm run dev`) lädt Änderungen automatisch neu und gibt hilfreiche Fehlermeldungen aus. Im echten Betrieb wird die Anwendung mit `npm run build` gebaut und mit `npm start` gestartet.

---

## 8. Simulator starten

Der Simulator imitiert einen echten IoT-Sensor und sendet Testdaten an das Backend. Das ist nützlich, wenn du keine physische Hardware hast.

```bash
# In den Simulator-Ordner wechseln
cd apps/simulator

# Abhängigkeiten installieren
pip install -r requirements.txt

# Simulator starten
python app.py
```

Der Simulator schickt jetzt alle paar Sekunden simulierte Messdaten an das Backend. Diese erscheinen dann im Frontend auf der Karte.

### Simulator konfigurieren

Du kannst das Verhalten über Umgebungsvariablen steuern:

| Variable | Beschreibung | Standardwert |
|----------|-------------|--------------|
| `DEVICE_NAME` | Name des simulierten Geräts | `Simulator-001` |
| `DEVICE_EUI` | Eindeutige Geräte-ID | zufällig generiert |
| `SLEEP_TIME` | Wartezeit zwischen Nachrichten (in Sekunden) | `5` |
| `BACKEND_API_URL` | URL des Backends | `http://localhost:8000` |

Beispiel (Linux/macOS):
```bash
SLEEP_TIME=10 DEVICE_NAME=MeinSensor python app.py
```

---

## 9. Projektstruktur verstehen

```
citbin/
├── apps/
│   ├── api/               ← Backend (Python / FastAPI)
│   │   ├── app.py         ← Einstiegspunkt: startet den Server
│   │   ├── models/        ← Datenmodelle (wie sehen die Daten aus?)
│   │   ├── routers/       ← API-Endpunkte (was kann die API?)
│   │   ├── modules/       ← Hilfsfunktionen und Logik
│   │   ├── migrations/    ← Datenbankmigrationen (Versionierung)
│   │   ├── tests/         ← Automatische Tests
│   │   └── requirements.txt ← Python-Abhängigkeiten
│   │
│   ├── web/               ← Frontend (TypeScript / Next.js)
│   │   ├── app/           ← Seiten der Weboberfläche
│   │   ├── components/    ← Wiederverwendbare UI-Bausteine
│   │   └── package.json   ← JavaScript-Abhängigkeiten
│   │
│   └── simulator/         ← Testsimulator (Python)
│
├── infrastructure/        ← Docker-Konfigurationen
├── docs/                  ← Projektdokumentation (du bist hier!)
└── README.md              ← Projektübersicht
```

### Backend im Detail (`apps/api/`)

```
api/
├── app.py              ← Startpunkt: initialisiert FastAPI, registriert Routen
├── dependencies.py     ← Datenbankverbindung wird hier als "Abhängigkeit" bereitgestellt
├── models/
│   ├── device.py       ← Datenmodell für IoT-Geräte
│   ├── trashbin.py     ← Datenmodell für Mülltonnen
│   └── trashbin_data.py ← Datenmodell für Sensormessungen
├── routers/
│   ├── devices.py      ← Endpunkte: /api/v0/device/...
│   ├── trashbin.py     ← Endpunkte: /api/v0/trashbin/...
│   ├── helium_uplink.py ← Endpunkt: empfängt Sensordaten vom Netzwerk
│   └── admin.py        ← Admin-Endpunkte (geschützt mit Passwort)
└── modules/
    ├── postgresql.py   ← Verbindung zur Datenbank herstellen
    ├── process_data.py ← Rohdaten vom Sensor in Datenbankeinträge umwandeln
    └── sensors/        ← Unterstützung verschiedener Sensortypen
```

### Frontend im Detail (`apps/web/`)

```
web/
├── app/
│   ├── page.tsx        ← Startseite (/)
│   ├── dashboard/      ← Karten-Dashboard (/dashboard)
│   ├── admin/          ← Admin-Verwaltung (/admin/overview)
│   └── about/          ← Über das Projekt (/about)
└── components/
    ├── Map.tsx         ← Leaflet-Karte mit Mülltonnen-Markern
    ├── StatusLabel.tsx ← Farbiges Status-Label (z.B. "Aktiv")
    ├── FillLevelLabel.tsx ← Füllstandsanzeige
    └── BatteryLabel.tsx   ← Batteriestandsanzeige
```

---

## 10. Wichtige Konzepte erklärt

### REST API

Eine **REST API** ist eine Schnittstelle, über die Programme über das Internet (HTTP) miteinander kommunizieren. Sie funktioniert nach dem Anfrage-Antwort-Prinzip:

| HTTP-Methode | Zweck | Beispiel |
|---|---|---|
| `GET` | Daten abrufen | Alle Mülltonnen anzeigen |
| `POST` | Neue Daten erstellen | Neue Mülltonne anlegen |
| `PUT` | Vorhandene Daten ändern | Mülltonne umbenennen |
| `DELETE` | Daten löschen | Mülltonne entfernen |

**Beispiel:** Der Browser des Frontend schickt eine GET-Anfrage an `http://localhost:8000/api/v0/trashbin/`, und das Backend antwortet mit einer Liste aller Mülltonnen als JSON-Daten.

### JSON

**JSON** (JavaScript Object Notation) ist ein einfaches Textformat zum Austausch von Daten zwischen Programmen. Es sieht so aus:

```json
{
  "id": "abc-123",
  "name": "Mülltonne Marktplatz",
  "location": "Marktplatz 5, Singen",
  "latest_fill_level": 75,
  "latitude": 47.7589,
  "longitude": 8.8374
}
```

### Datenbankmodelle (SQLModel)

In Python werden Datenbanktabellen als Klassen beschrieben. Eine Klasse `Trashbin` entspricht der Tabelle `trashbin` in PostgreSQL:

```python
# Vereinfachtes Beispiel aus models/trashbin.py
class Trashbin(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    name: str               # Name der Mülltonne
    location: str           # Standortbeschreibung
    latitude: float         # GPS-Breitengrad
    longitude: float        # GPS-Längengrad
    latest_fill_level: int  # Füllstand in Prozent (0-100)
```

### React-Komponenten

In Next.js/React wird die Benutzeroberfläche aus Komponenten zusammengesetzt. Eine Komponente ist eine wiederverwendbare Funktion, die HTML zurückgibt:

```tsx
// Vereinfachtes Beispiel: Eine Komponente, die den Füllstand anzeigt
function FillLevelLabel({ level }: { level: number }) {
  const color = level > 80 ? "red" : level > 50 ? "orange" : "green";
  return <span style={{ color }}>{level}%</span>;
}

// Verwendung:
<FillLevelLabel level={75} />  // → Zeigt "75%" in orange
```

### Umgebungsvariablen (.env)

Umgebungsvariablen ermöglichen es, Konfigurationswerte (Passwörter, Datenbankadresse etc.) außerhalb des Quellcodes zu speichern. Die `.env`-Datei wird beim Start des Programms geladen, ist aber **nicht** im Git-Repository gespeichert (dadurch landen keine Passwörter auf GitHub).

```dotenv
# .env Beispiel
POSTGRES_HOST=localhost     # Wo läuft die Datenbank?
POSTGRES_DB=citbin          # Name der Datenbank
ADMIN_PASSWORD=geheim123    # Passwort für Admin-Endpunkte
```

### Datenbankmigrationen (Alembic)

Wenn sich das Datenbankschema ändert (z.B. eine neue Spalte hinzukommt), muss auch die Datenbank aktualisiert werden. **Alembic** verwaltet diese Änderungen als versionierte Migrationsskripte.

```bash
# Datenbank auf den neuesten Stand bringen
alembic upgrade head

# Neue Migration erstellen (nach Modelländerungen)
alembic revision --autogenerate -m "Beschreibung der Änderung"
```

---

## 11. Häufige Entwicklungsaufgaben

### Eine neue API-Route hinzufügen

1. Öffne die passende Datei in `apps/api/routers/`
2. Füge eine neue Funktion mit dem `@router.get()` oder `@router.post()` Dekorator hinzu:

```python
@router.get("/meine-route")
def meine_funktion():
    return {"nachricht": "Hallo Welt!"}
```

3. Starte das Backend neu und teste die Route unter http://localhost:8000/api/docs

### Eine neue Frontend-Seite hinzufügen

In Next.js wird eine neue Seite einfach durch Erstellen einer neuen Datei im `app/`-Ordner erstellt:

1. Erstelle eine neue Datei: `apps/web/app/meine-seite/page.tsx`
2. Füge eine einfache Komponente hinzu:

```tsx
export default function MeineSeite() {
  return <h1>Hallo von meiner neuen Seite!</h1>;
}
```

3. Die Seite ist automatisch erreichbar unter http://localhost:3000/meine-seite

### Datenbankmodell ändern

1. Öffne die Modelldatei in `apps/api/models/`
2. Füge das neue Feld hinzu, z.B. in `trashbin.py`:
```python
beschreibung: str | None = None   # Neue optionale Spalte
```
3. Erstelle eine neue Migration:
```bash
cd apps/api
alembic revision --autogenerate -m "Beschreibung hinzugefügt"
```
4. Führe die Migration aus:
```bash
alembic upgrade head
```

### Änderungen mit Git speichern

```bash
# Status anzeigen (welche Dateien wurden geändert?)
git status

# Änderungen zur Staging-Area hinzufügen
git add apps/api/routers/meine_datei.py

# Änderungen committen (mit Beschreibung)
git commit -m "Neue Route für XY hinzugefügt"

# Änderungen zu GitHub hochladen
git push
```

---

## 12. Tests ausführen

Das Backend hat automatische Tests, die sicherstellen, dass der Code korrekt funktioniert.

```bash
# In das Backend-Verzeichnis wechseln
cd apps/api

# Virtuelle Umgebung aktivieren (falls nicht aktiv)
# Windows:
venv\Scripts\activate
# Linux / macOS:
source venv/bin/activate

# Alle Tests ausführen
pytest -v tests/

# Tests mit Anzeige der Code-Abdeckung (Coverage)
pytest --cov=app tests/

# Tests mit detailliertem HTML-Bericht
pytest --cov=app tests/ --cov-report html
# → Bericht wird im Ordner htmlcov/ gespeichert
```

**Was bedeutet Code-Abdeckung (Coverage)?**  
Code-Abdeckung zeigt an, welcher Prozentsatz des Codes durch Tests überprüft wurde. 80%+ gilt als guter Wert.

**Testdateien:**
- `tests/test_app.py` – Allgemeine Tests der Anwendung
- `tests/test_devices_router.py` – Tests für Geräte-Endpunkte
- `tests/conftest.py` – Testkonfiguration und Hilfsdaten (Fixtures)

---

## 13. Fehlersuche (Troubleshooting)

### ❌ `python` nicht gefunden

Auf manchen Systemen heißt der Befehl `python3` statt `python`:

```bash
python3 --version
python3 -m venv venv
```

### ❌ `pip` nicht gefunden

```bash
python -m pip install -r requirements.txt
# oder
python3 -m pip install -r requirements.txt
```

### ❌ Backend startet nicht (Datenbankfehler)

Das Backend kann die Datenbank nicht erreichen. Mögliche Ursachen:
1. Docker läuft nicht → Docker Desktop starten und `docker ps` prüfen
2. Falsche Verbindungsdaten → `.env`-Datei prüfen
3. Port bereits belegt → prüfen ob PostgreSQL lokal läuft (`sudo systemctl status postgresql`)

### ❌ Frontend zeigt keine Daten an

Das Frontend kann das Backend nicht erreichen:
1. Läuft das Backend? → http://localhost:8000/api/health prüfen
2. Ist der richtige Port konfiguriert? → Prüfe die `.env.local` im Frontend-Verzeichnis

### ❌ `npm install` schlägt fehl

```bash
# Cache leeren und neu versuchen
npm cache clean --force
npm install

# Oder node_modules löschen und neu installieren
rm -rf node_modules
npm install
```

### ❌ Virtuelle Umgebung vergessen zu aktivieren

Wenn Pakete nicht gefunden werden, liegt es oft daran, dass die virtuelle Umgebung nicht aktiv ist. Prüfe, ob `(venv)` in der Eingabezeile steht, und aktiviere sie falls nötig:

```bash
# Windows:
venv\Scripts\activate

# Linux / macOS:
source venv/bin/activate
```

### ❌ Port bereits belegt

Wenn ein Port (z.B. 8000 oder 3000) bereits von einem anderen Prozess genutzt wird:

```bash
# Linux / macOS: Prozess auf Port 8000 finden
lsof -i :8000

# Windows:
netstat -ano | findstr :8000
```

---

## Weiterführende Ressourcen

Wenn du tiefer in die verwendeten Technologien einsteigen möchtest:

| Technologie | Offizielle Dokumentation | Sprache |
|---|---|---|
| Python | https://docs.python.org/de/3/ | Deutsch verfügbar |
| FastAPI | https://fastapi.tiangolo.com | Englisch |
| SQLModel | https://sqlmodel.tiangolo.com | Englisch |
| Next.js | https://nextjs.org/docs | Englisch |
| React | https://de.react.dev | Deutsch verfügbar |
| TypeScript | https://www.typescriptlang.org/docs/ | Englisch |
| PostgreSQL | https://www.postgresql.org/docs/ | Englisch |
| Docker | https://docs.docker.com | Englisch |
| Git | https://git-scm.com/book/de/v2 | Deutsch verfügbar |
| Alembic | https://alembic.sqlalchemy.org | Englisch |

---

*Letzte Aktualisierung: März 2026 | CitBin – TG12/3, Hohentwiel Gewerbeschule Singen*
