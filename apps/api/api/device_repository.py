
from sqlmodel import Session, select
from typing import List, Optional
import logging

from models.device import Device


def get_device_by_id(db, device_id: str) -> Optional[Device]:
    """
    Returns a device by its ID.

    Args:
        device_id: UUID of the device

    Returns:
        Device object or None if the device was not found
    """
    with Session(db) as session:
        statement = select(Device).where(Device.id == device_id)
        results = session.exec(statement)
        result = results.first()

    return result


def get_all(db) -> List[Device]:
    """
    Returns a list of all devices.

    Args:
        db: Database connection
        request: Request object

    Returns:
        List of all devices
    """
    with Session(db) as session:
        statement = select(Device.id).order_by(Device.last_seen)
        results = session.exec(statement)
        list = results.all()

    return list


def get_all_of_trashbin(db, trashbin_id: str) -> List[Device]:
    """
    Returns a list of all devices of given trashbin.
    Args:
        trashbin_id: UUID of the trashbin

    Args:
        db: Database connection
        request: Request object

    Returns:
        List of all devices
    """
    with Session(db) as session:
        statement = select(Device).where(Device.trashbin_id == trashbin_id)
        results = session.exec(statement)
        list = results.all()

    return list


def remove(db, device_id: str) -> bool:
    """
    Removes a device.

    Args:
        device_id: UUID of the device to remove

    Returns:
        True if the device was successfully removed, otherwise False
    """
    with Session(db) as session:
        statement = select(Device).where(Device.id == device_id)
        results = session.exec(statement)
        result = results.first()
        if result:
            session.delete(result)
            session.commit()
            return True
        else:
            return False


def create(db, device: Device) -> Device:
    """
    Creates a new device from the provided data.

    Args:
        device: Dictionary containing device data

    Returns:
        The created Device object
    """

    with Session(db) as session:
        session.add(device)
        session.commit()
        session.refresh(device)

    return device


def update(db, id: str, data: Device) -> Device:
    """
    Updates an existing device with the provided data.

    Args:
        db: Database connection
        id: UUID of the device to update
        data: Device object containing updated data

    Returns:
        The updated Device object
    """
    logging.info(f"-> UPDATE request for ID: {id} with data:\n{data.model_dump(exclude_unset=True)}")
    with Session(db) as session:
        data.id = id  # Ensure the ID is set to the one being updated
        result = session.query(Device).where(Device.id == id).update(data.model_dump())
        if result:
            # If the update was successful, we need to commit the changes        
            session.commit()
            updated_device = session.query(Device).where(Device.id == id).one()
            logging.info(f"<- Device with ID {id} updated successfully:\n{updated_device}")
            return updated_device
        else:
            # If the device was not found, return None
            logging.error(f"Device with ID {id} not found for update")
            return None
        
