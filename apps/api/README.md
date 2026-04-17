# CitBin - Backend API

## Running Backend Locally

> **Achtung**
>
> Es wird die Python-Version `3.11+` benötigt!

### Mit UV (empfohlen)

```bash
# Umgebungsvariablen setzen (.env.example zu .env kopieren)
cp .env.example .env

# Dependencies installieren (inkl. dev-dependencies)
uv sync --dev

# Backend starten
uv run uvicorn app:app --reload
```

### Mit pip (alternativ)

```bash
# Create and activate a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv/scripts/activate

# Install dependencies
pip install -r requirements.txt

# run
python app.py
```

## run tests
```bash
# Mit UV
uv run pytest -v tests/

# Mit pip
pytest -v tests/

# Mit coverage
uv run pytest --cov=app tests/ --cov-report html
```

### Running the development infrastructure docker stack:
Which runs the entire development infrastructure except for the frontend and backend

```bash
cd ../../infrastructure
./update-development.sh # On Windows: ./update-development.bat
```

### Open-API documentation

API could be accessed by: http://localhost:8000/api/docs

## Database Migrations with Alembic

This project uses Alembic for database migration management. Here are the key commands:

### Initialization

To bring the database up to date with the latest schema:

```bash
uv run alembic upgrade head
```

### Creating a New Migration

When you've made changes to the database models, you can create a new migration:

```bash
uv run alembic revision --autogenerate -m "Description of changes"
```

Alembic will compare the current models with the database schema and generate a migration file in the `migrations/versions/` directory.

### Applying Migrations

To apply the latest migration:

```bash
uv run alembic upgrade head
```

To migrate to a specific version:

```bash
uv run alembic upgrade <revision>
```

### Rolling Back Migrations

To roll back the last migration:

```bash
uv run alembic downgrade -1
```

To return to a specific version:

```bash
uv run alembic downgrade <revision>
```

### Viewing Migration History

```bash
uv run alembic history
```

### Tips for Working with Alembic

1. **Review Generated Migrations**: Alembic may not detect all changes automatically. Review the generated migration files before applying them.

2. **Test Migrations in a Development Environment**: Always run migrations in a development environment before applying them to production.

3. **Version Control**: Add all migration files to version control so all developers use the same migrations.

4. **Data Preservation**: Be careful with schema changes that might result in data loss. Add data migration steps if needed.

5. **Environment Variables**: Alembic uses the same database connection parameters as the main application, loaded from the `.env` file.

## Database structure

The database is designed to store information about devices, trash bins, and their associated data logs. The main entities in the database are:
- **Device**: Represents a device that can be associated with a trash bin. It contains information such as device ID, name, battery level and the assigned trashbin.
- **Trashbin**: Represents a trash bin that can be monitored. It contains information such as trash bin ID, name, type, and location.
- **DataLog**: Represents the data logs for each trash bin. It contains information such as the time of the log, fill level, and distance.
