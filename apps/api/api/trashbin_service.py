import logging
import uuid
from typing import List, Optional
from api import trashbin_repository
from models.api_models import TrashbinListItem, TrashbinResponse, TrashbinCreate, TrashbinUpdate
from models.trashbin import Trashbin
from fastapi import HTTPException
from modules.trashbin_factory import TrashbinFactory


def get_list(db) -> List[TrashbinListItem]:
    """
    Returns a list of all trashbins.

    Args:
        db: Database connection

    Returns:
        List of all trashbins
    """
    results = trashbin_repository.get_list(db)

    # Convert Trashbin objects to TrashbinListItem objects for the response
    list: List[TrashbinListItem] = []
    for trashbin_model in results:
        try:
            trashbin_dict = trashbin_model.model_dump()
            trashbin_dict['has_device'] = trashbin_repository.has_device(db, trashbin_model.id)
            list_item = TrashbinListItem.model_validate(trashbin_dict)
            list.append(list_item)
        except Exception as e:
            # Log error and skip problematic device to avoid complete failure of the endpoint
            device_id_for_log = getattr(trashbin_model, 'id', 'unknown_id_in_trashbin_model')
            logging.error(f"Error validating trashbin {device_id_for_log} to TrashbinListItem: {e}")
            # Continue to the next device
    return list


def get(db, trashbin_id: str) -> Optional[TrashbinResponse]:
    """
    Returns detailed information about a specific trashbin.

    Args:
        db: Database connection
        trashbin_id: UUID of the trashbin

    Returns:
        TrashbinResponse object with trashbin details or None if the trashbin was not found
    """
    result = trashbin_repository.get(db, trashbin_id)
    if result is None:
        return None

    # Convert the SQLModel to a dictionary before validating with Pydantic
    trashbin_dict = result.to_dict() if hasattr(result, 'to_dict') else result.model_dump()

    # Validate the dictionary with TrashbinResponse
    return TrashbinResponse.model_validate(trashbin_dict)


def create(db, trashbin_create: TrashbinCreate) -> TrashbinResponse:
    """
    Create new trashbin

    Args:
        db: Database connection
        trashbin_create: Request object

    Returns:
        Created trashbin
    """
    # Create a new Trashbin object
    trashbin_dict = trashbin_create.model_dump()
    trashbin_dict['id'] = str(uuid.uuid4())
    trashbin_dict['last_update_time'], trashbin_dict['latest_data_id'], trashbin_dict['latest_fill_level'] = None, None, None
    trashbin = Trashbin.model_validate(trashbin_dict)
    trashbin = trashbin_repository.create(db, trashbin)

    # Convert the SQLModel to a dictionary before validating with Pydantic
    trashbin_dict = trashbin.to_dict() if hasattr(trashbin, 'to_dict') else trashbin.model_dump()

    # Validate the dictionary with TrashbinResponse
    return TrashbinResponse.model_validate(trashbin_dict)


def update(db, trashbin_id: str, trashbin_update: TrashbinUpdate) -> Optional[TrashbinResponse]:
    """
    Update an existing trashbin.

    Args:
        db: Database session.
        trashbin_id: ID of the trashbin to update.
        trashbin_update: Trashbin object with updated data.

    Returns:
        Updated Trashbin object or None if the trashbin was not found.
    """
    logging.info(f"-> UPDATE request for trashbin with ID: {trashbin_id}")

    trashbin_dict = trashbin_update.model_dump()

    trashbin = Trashbin.model_validate(trashbin_dict)

    result = trashbin_repository.update(db, trashbin_id, trashbin)
    if result:
        logging.info(f"<- Trashbin {trashbin_id} updated successfully")
        return TrashbinResponse.model_validate(result)
    else:
        logging.error(f"<- Trashbin {trashbin_id} not found")
        raise HTTPException(status_code=404, detail="Trashbin not found")


def delete(db, trashbin_id: str) -> bool:
    """
    Delete a specific trashbin.

    Args:
        db: Database connection
        trashbin_id: UUID of the trashbin

    Returns:
        Confirmation message if successful, or None if the device was not found or deletion failed.
    """
    result = trashbin_repository.delete(db, trashbin_id)
    if result:
        result = trashbin_repository.delete_data(db, trashbin_id)
    if result:
        return {"status": "success", "message": f"Trashbin {trashbin_id} and its data history deleted"}
    else:
        return {"status": "fail", "message": f"Trashbin {trashbin_id} not found"}

def get_profiles() -> List[str]:
    """
    Returns a list of all available trashbin profiles.

    Returns:
        List of profile names
    """
    profiles = TrashbinFactory.get_all_trashbins()
    return list(profiles.keys())