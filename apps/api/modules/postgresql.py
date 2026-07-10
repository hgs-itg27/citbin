from sqlalchemy import URL, create_engine
from sqlmodel import SQLModel
import logging
logger = logging.getLogger(__name__)
from models import trashbin, trashbin_data, device


def connect(config):
    """
    Connect to PostgreSQL database using SQLAlchemy
    """
    logger.info("Connecting to PostgreSQL DB on %s:%s", config["host"], config["port"])
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
    logger.info("Connected to PostgreSQL")
    return engine


def create_tables(engine):
    SQLModel.metadata.create_all(engine)
    logger.debug("Tables: %s", SQLModel.metadata.tables.keys())