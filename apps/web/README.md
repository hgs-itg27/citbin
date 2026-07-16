# mhgs

## Installation unter Windows

```
winget install -e --id Git.Git
```

```
winget install -e --id OpenJS.NodeJS
```

```
winget install -e --id GitHub.cli
```

Neues Terminal (Altes schliessen)

```
git clone https://github.com/hgs-itg26/mhgs-software.git
```

*Es sollte automatisch ein Fenster für die Verbindung mit Github erscheinen. Klicke dort auf die Browser-Option. Falls
sich kein Fenster öffnet, bitte folgendes Tutorial
verwenden: https://docs.github.com/en/github-cli/github-cli/quickstart oder versuche folgenden Befehl `gh auth login`*

```
cd mhgs\server\frontend
```

```
npm install
```

*Falls der NPM Befehl nicht erkannt wird, sollte man bitte die Installation von NodeJS wiederholen. Folgender Link hat
einen .EXE Installer parat: https://nodejs.org/en/download hier sollte man darauf achten, die richtigen Einstellungen
getätigt zu haben.*

## Installation unter Linux

### Installation unter Debian/Ubuntu

1. **Paketquellen aktualisieren:**
   ```bash
   sudo apt update
   ```

2. **Git installieren:**
   ```bash
   sudo apt install git -y
   ```

3. **Node.js und npm installieren:**
   ```bash
   sudo apt install nodejs npm -y
   ```

4. **GitHub CLI installieren:**
   Folge den [offiziellen Anweisungen von Github selbst](https://github.com/cli/cli/blob/trunk/docs/install_linux.md).

6. **Neues Terminal öffnen (optional):**
   Es ist empfehlenswert, ein neues Terminalfenster zu öffnen, um sicherzustellen, dass alle Pfade korrekt erkannt
   werden.

7. **Repository klonen:**
   ```bash
   git clone https://github.com/hgs-itg26/mhgs-software.git
   ```
   *Authentifizierung:* Eventuell musst du dich bei GitHub authentifizieren. Folge den Anweisungen im Terminal oder
   nutze `gh auth login` und wähle die Browser-Option.

8. **In das Verzeichnis wechseln:**
   *Beachte: Linux verwendet `/` als Pfadtrenner.*
   ```bash
   cd citbin/apps/web
   ```

9. **Abhängigkeiten installieren:**
   ```bash
   npm install
   ```
   *Falls der `npm` Befehl nicht gefunden wird, überprüfe die Node.js/npm Installation (Schritt 3) oder starte dein
   Terminal neu.*

---

### Installation unter Fedora

1. **Paketquellen aktualisieren (optional, aber empfohlen):**
   ```bash
   sudo dnf check-update
   ```

2. **Git installieren:**
   ```bash
   sudo dnf install git -y
   ```

3. **Node.js und npm installieren:**
   ```bash
   sudo dnf install nodejs npm -y
   ```
   *(Oft wird npm automatisch mit nodejs installiert. Falls nicht, installiere es separat: `sudo dnf install npm -y`)*

4. **GitHub CLI installieren:**
   ```bash
   sudo dnf install gh -y
   ```
   *Falls das nicht funktioniert folge
   den [offiziellen Anweisungen von Github selbst](https://github.com/cli/cli/blob/trunk/docs/install_linux.md).*

5. **Neues Terminal öffnen (optional):**
   Es ist empfehlenswert, ein neues Terminalfenster zu öffnen, um sicherzustellen, dass alle Pfade korrekt erkannt
   werden.

6. **Repository klonen:**
   ```bash
   git clone https://github.com/hgs-itg26/mhgs-software.git
   ```
   *Authentifizierung:* Eventuell musst du dich bei GitHub authentifizieren. Folge den Anweisungen im Terminal oder
   nutze `gh auth login` und wähle die Browser-Option.

7. **In das Verzeichnis wechseln:**
   *Beachte: Linux verwendet `/` als Pfadtrenner.*
   ```bash
   cd citbin/apps/web
   ```

8. **Abhängigkeiten installieren:**
   ```bash
   npm install
   ```
   *Falls der `npm` Befehl nicht gefunden wird, überprüfe die Node.js/npm Installation (Schritt 3) oder starte dein
   Terminal neu.*

---

## Starten des Developement-Servers (localhost)

```
npm run dev
```
