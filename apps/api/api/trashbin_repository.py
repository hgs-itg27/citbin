import logging

logger = logging.getLogger(__name__)
from typing import Optional, List
from models.trashbin import Trashbin
from models.device import Device
from models.trashbin_data import DataLog
from sqlmodel import Session, select
from sqlalchemy import delete as sql_delete


def get_list(db) -> List[Trashbin]:
    """
    Returns a list of all trashbins.
    Args:
        db: Database connection
    Returns:
        List of all trashbins
    """
    list = []
    with Session(db) as session:
        statement = select(Trashbin).order_by(Trashbin.name)
        results = session.exec(statement)
        list = results.all()
    return list

def has_device(db, trashbin_id: str) -> bool:
    """
    Returns boolean wheter Trashbin has devices assigned to it
    Args:
        db: Databse connection
        trashbin_id: UUID of the trashbin
    Returns:
        bool
    """
    with Session(db) as session:
        device = session.exec(
            select(Device).where(Device.trashbin_id == trashbin_id)
        ).first()
    has_device = device != None
    return has_device


def get(db, trashbin_id: str) -> Optional[Trashbin]:
    """
    Returns detailed information about a specific trashbin.
    Args:
        db: Database connection
        trashbin_id: UUID of the trashbin
    Returns:
        TrashbinResponse object with trashbin details or None if the trashbin was not found
    """
    logger.debug("Processing trashbin GET request with ID: %s", trashbin_id)
    with Session(db) as session:
        trashbin = session.get(Trashbin, trashbin_id)
    if trashbin is None:
        logger.warning("Trashbin %s not found", trashbin_id)
        return None

    
    return trashbin


def create(db, trashbin: Trashbin) -> Trashbin:
    """
    Create new trashbin
    Args:
        db: Database connection
        trashbin: Trashbin object
    Returns:
        Created Trashbin object
    """
    logger.debug("Creating trashbin")
    with Session(db) as session:
        session.add(trashbin)
        session.commit()
        session.refresh(trashbin)
    logger.debug("Trashbin %s created successfully", trashbin.id)
    return trashbin


def update(db, trashbin_id: int, trashbin: Trashbin) -> Optional[Trashbin]:
    """
    Update an existing trashbin.
    Args:
        db: Database session.
        trashbin_id: ID of the trashbin to update.
        trashbin: Trashbin object with updated data.
    Returns:
        Updated Trashbin object.
    """
    logger.debug("Updating trashbin %s", trashbin_id)

    with Session(db) as session:
        result = session.get(Trashbin, trashbin_id)
        if result:
            for k, v in trashbin.model_dump(exclude_unset=True).items():
                setattr(result, k, v)
            session.commit()
            session.refresh(result)
            logger.debug("Trashbin %s updated successfully", trashbin_id)
            return result
        else:
            logger.error("Trashbin %s not found for update", trashbin_id)
            return None


def delete(db, trashbin_id: int):
    with Session(db) as session:
        trashbin = session.get(Trashbin, trashbin_id)
        if trashbin is None:
            return False
        session.delete(trashbin)
        session.commit()
    return True

def delete_data(db, trashbin_id: str) -> bool:
    """
    Deletes all data of a trashbin.
    Args:
        db: Database connection
        trashbin_id: ID of the trashbin
    Returns:
        True if data was deleted, False if trashbin was not found
    """
    logger.debug("Deleting data for trashbin %s", trashbin_id)
    with Session(db) as session:
        session.exec(
            sql_delete(DataLog).where(DataLog.trashbin_id == trashbin_id)
        )
        session.commit()
    logger.debug("Trashbin %s data deleted successfully", trashbin_id)
    return True
