from sqlalchemy import URL, create_engine
from sqlmodel import SQLModel
import logging
from models import trashbin, trashbin_data, device


def connect(config):
    """
    Connect to PostgreSQL database using SQLAlchemy
    """
    logging.info(f"Connecting to PostgreSQL DB on {config['host']}:{config['port']}")
    url = URL.create(
        'postgresql+psycopg2',
        username=config['username'],
        password=config['password'],
        host=config['host'],
        port=config['port'],
        database=config['database']
    )
    engine = create_engine(url, echo=False)
    # test if db connection exists
    with engine.connect() as test:
        ...
    logging.info('Connected to PostgreSQL DB')
    return engine


def create_tables(engine):
    SQLModel.metadata.create_all(engine)
    logging.info(f'Tables: {SQLModel.metadata.tables.keys()}')