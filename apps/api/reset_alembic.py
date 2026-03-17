import os
import sys
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database connection parameters
DB_HOST = os.getenv("POSTGRES_HOST", "localhost")
DB_PORT = os.getenv("POSTGRES_PORT", "5432")
DB_USER = os.getenv("POSTGRES_USER", "postgres")
DB_PASS = os.getenv("POSTGRES_PASSWORD", "postgres")
DB_NAME = os.getenv("POSTGRES_DB", "postgres")

# Create database URL
DB_URL = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

def reset_alembic():
    """Reset Alembic version tracking by dropping and recreating the alembic_version table."""
    engine = create_engine(DB_URL)
    
    with engine.connect() as conn:
        # Check if alembic_version table exists
        result = conn.execute(text(
            "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'alembic_version')"
        ))
        table_exists = result.scalar()
        
        if table_exists:
            print("Dropping alembic_version table...")
            conn.execute(text("DROP TABLE alembic_version"))
            conn.commit()
            print("Table dropped successfully.")
        else:
            print("alembic_version table doesn't exist. Nothing to drop.")
        
        # Check and drop existing tables to start fresh
        tables = ['device', 'trashbin', 'datalog']
        for table in tables:
            result = conn.execute(text(
                f"SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = '{table}')"
            ))
            if result.scalar():
                print(f"Dropping {table} table...")
                conn.execute(text(f"DROP TABLE IF EXISTS {table} CASCADE"))
                conn.commit()
                print(f"{table} table dropped successfully.")
        
        print("Alembic version tracking has been reset.")

if __name__ == "__main__":
    reset_alembic()
    print("Now you can run 'alembic upgrade head' to apply the custom migration.")
