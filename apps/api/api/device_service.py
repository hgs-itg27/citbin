import logging
from typing import List, Optional  # Ensure List and Optional are imported
from models.api_models import DeviceResponse, DeviceUpdate, DeviceCreate, DeviceListItem
from modules.sensor_factory import SensorFactory

from models.device import Device
from api import device_repository


def get_list(db) -> List[DeviceListItem]:
    """
    Returns a list of simplified device information.

    Args:
        db: Database connection

    Returns:
        List[DeviceListItem]: A list of devices with their core information.
    """
    # The traceback indicates that device_repository.get_all(db) might be returning
    # a list of strings (device IDs) instead of full Device objects.
    # This revised logic handles both cases: a list of Device objects or a list of device IDs.
    items_from_repo = device_repository.get_all(db)
    
    actual_device_objects: List[Device] = []
    if not items_from_repo:
        # Repository returned an empty list
        logging.info("device_repository.get_all returned an empty list.")
        pass
    elif isinstance(items_from_repo[0], str):
        # Assuming List[str] of device IDs, as suggested by the traceback
        logging.info("device_repository.get_all returned list of IDs. Fetching full Device objects.")
        for device_id in items_from_repo:
            device_obj = device_repository.get_device_by_id(db, device_id)
            if device_obj: # device_repository.get_device_by_id returns Optional[Device]
                actual_device_objects.append(device_obj)
            else:
                logging.warning(f"Device with ID {device_id} not found during list construction, skipping.")
    elif isinstance(items_from_repo[0], Device):
        # Assuming List[Device] was returned directly
        logging.info("device_repository.get_all returned list of Device objects.")
        actual_device_objects = items_from_repo
    else:
        # Unexpected type from repository
        logging.error(f"device_repository.get_all returned list of unexpected type: {type(items_from_repo[0])}. Returning empty list.")
        return [] # Or raise an appropriate error

    # Convert Device objects to DeviceListItem objects for the response
    response_list: List[DeviceListItem] = []
    for device_model in actual_device_objects:
        try:
            response_list.append(DeviceListItem.model_validate(device_model))
        except Exception as e:
            # Log error and skip problematic device to avoid complete failure of the endpoint
            device_id_for_log = getattr(device_model, 'id', 'unknown_id_in_device_model')
            logging.error(f"Error validating device {device_id_for_log} to DeviceListItem: {e}")
            # Continue to the next device

    logging.info(f"Returning list of {len(response_list)} devices.")
    return response_list


def get_devices_of_trashbin(db, trashbin_id: str) -> List[DeviceListItem]:

    """
    Returns a list of devices associated with a specific trashbin.
    Args:
        db: Database connection
        trashbin_id: UUID of the trashbin
    Returns:
        List[DeviceListItem]: A list of devices associated with the trashbin.
    """
    logging.info(f"Processing device GET request for trashbin with ID: {trashbin_id}")
    response_list: List[DeviceListItem] = []

    # Fetch devices associated with the given trashbin_id
    # and convert them to DeviceListItem objects
    # using the SQLModel's model_dump method for serialization
    # and validation with Pydantic
    list = device_repository.get_all_of_trashbin(db, trashbin_id)
    if not list:
        logging.info(f"No devices found for trashbin with ID: {trashbin_id}")
        return []
    else:
        logging.info(f"Found {len(list)} devices for trashbin with ID: {trashbin_id}")
    # Convert Device objects to DeviceListItem objects for the response
    for device_model in list:
        try:
            # Convert the SQLModel to a dictionary before validating with Pydantic
            device_dict = device_model.to_dict() if hasattr(device_model, 'to_dict') else device_model.model_dump()
            # Validate the dictionary with DeviceListItem
            response_list.append(DeviceListItem.model_validate(device_dict))
        except Exception as e:
            # Log error and skip problematic device to avoid complete failure of the endpoint
            device_id_for_log = getattr(device_model, 'id', 'unknown_id_in_device_model')
            logging.error(f"Error validating device {device_id_for_log} to DeviceListItem: {e}")
            # Continue to the next device

    return response_list


def get_device(db, device_id: str) -> Optional[DeviceResponse]:
    """
    Returns detailed information about a specific device.

    Args:
        db: Database connection
        device_id: UUID of the device

    Returns:
        DeviceResponse object with device details or None if the device was not found
    """

    logging.info(f"Processing device GET request with ID: {device_id}")
    result = device_repository.get_device_by_id(db, device_id)
    if result is None:
        return None

    # Convert the SQLModel to a dictionary before validating with Pydantic
    device_dict = result.to_dict() if hasattr(result, 'to_dict') else result.model_dump()

    # Validate the dictionary with DeviceResponse
    return DeviceResponse.model_validate(device_dict)


def create(db, deviceCreate: DeviceCreate) -> DeviceResponse:
    """
    Create new device

    Args:
        db: Database connection
        deviceCreate: Request object

    Returns:
        Created device
    """
    logging.info(f"Processing device POST request with data: {deviceCreate}")
    # Create a new Device object
    device = Device.from_device_create(deviceCreate)  

    # Create a new device using the repository function
    new_device = device_repository.create(db, device)

    # Convert the SQLModel to a dictionary before validating with Pydantic
    device_dict = new_device.to_dict() if hasattr(new_device, 'to_dict') else new_device.model_dump()

    # Validate the dictionary with DeviceResponse
    return DeviceResponse.model_validate(device_dict)


def update(db, device_id: str, device_update: DeviceUpdate) -> Optional[DeviceResponse]:
    """
    Update an existing device.

    Args:
        db: Database session.
        device_id: UUID of the device to update.
        device_update: Pydantic model with update data.

    Returns:
        Updated device details or None if the device was not found.
    """
    logging.info(f"Processing device UPDATE request for ID: {device_id} with data: {device_update.model_dump(exclude_unset=True)}")

    existing_device = device_repository.get_device_by_id(db, device_id)
    if not existing_device:
        return None

    # Get the update data, excluding unset fields
    update_data = device_update.model_dump(exclude_unset=True)

    # Apply updates to the existing device
    for key, value in update_data.items():
        if hasattr(existing_device, key):
            setattr(existing_device, key, value)
        else:
            logging.warning(f"Key '{key}' from DeviceUpdate not found on Device model for ID {device_id}")

    # Update the device in the database
    try:
        updated_db_device = device_repository.update(db, device_id, existing_device)

        # Verify that we got a valid device back
        if not updated_db_device:
            logging.error(f"Failed to update device {device_id} - repository returned None")
            return None

            
        # Validate the dictionary with DeviceResponse
        return DeviceResponse.model_validate(updated_db_device.model_dump())
    except Exception as e:
        logging.error(f"Error updating device {device_id}: {str(e)}")
        raise


def delete(db, device_id: str) -> Optional[dict]:
    """
    Deletes a device.

    Args:
        db: Database session.
        device_id: UUID of the device to delete.

    Returns:
        Confirmation message if successful, or None if the device was not found or deletion failed.
    """
    if device_repository.remove(db, device_id): # Corrected call to repository
        return {"status": "success", "message": f"Device {device_id} deleted"}
    return None

def get_profiles(db) -> List[str]:
    """
    Returns a list of all available sensor profiles.

    Returns:
        List of profile names
    """

    profiles = SensorFactory.get_all_sensors()
    return list(profiles.keys())