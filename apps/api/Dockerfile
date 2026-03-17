# Build-Stage für Python dependencies
FROM python:3.13-slim AS python-deps

WORKDIR /app
# Install build dependencies for Python packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    python3-dev \
    curl \
    && rm -rf /var/libraries/apt/lists/*

# Kopiere nur die requirements.txt zuerst für besseres Layer-Caching
COPY requirements.txt .
RUN python -m venv /opt/venv && \
    /opt/venv/bin/pip install --no-cache-dir --upgrade pip && \
    /opt/venv/bin/pip install --no-cache-dir -r ./requirements.txt && \
    /opt/venv/bin/pip install --no-cache-dir gunicorn

# Final stage mit minimaler Image-Größe
FROM python:3.13-slim

WORKDIR /app

# Installiere nur die notwendigen Laufzeitabhängigkeiten
RUN apt-get update && apt-get install -y --no-install-recommends \
    tzdata \
    curl \
    && rm -rf /var/libraries/apt/lists/*

ENV TZ=Europe/Berlin
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN groupadd -r appuser && useradd -r -g appuser appuser



# Konfiguration für die Datenbank
ENV PATH="/opt/venv/bin:$PATH"
ENV POSTGRES_HOST=localhost
ENV POSTGRES_PORT=5432
ENV POSTGRES_DB=citbin
ENV POSTGRES_USER=citbin
ENV POSTGRES_PASSWORD=citbin2025!

# Port-Konfiguration
EXPOSE 8000

# Kopiere Python virtual environment aus dem Build-Stage
COPY --from=python-deps /opt/venv /opt/venv

# Kopiere Backend-Code
COPY --chown=appuser:appuser . .

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
   CMD curl -f http://localhost:8000/api/health || exit 1

# Wechsle zum nicht-root Benutzer für Sicherheit
USER appuser

# Starte Anwendung mit optimierten Einstellungen
CMD ["gunicorn", "app:app", "-k", "uvicorn.workers.UvicornWorker", "-b", "0.0.0.0:8000", "--workers", "4", "--worker-class", "uvicorn.workers.UvicornWorker"]

