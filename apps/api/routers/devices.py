from fastapi import APIRouter, status, Depends, HTTPException
from typing import Dict, List
import logging
from api import device_service
from dependencies import get_dependencies
from models.api_models import DeviceResponse, DeviceUpdate, DeviceCreate, DeviceListItem
import modules.admin_auth as admin_auth

router = APIRouter(
    prefix="/device",
    tags=["Devices"]
)

@router.get("/profiles", response_model=List[str])
def get_profiles(deps: Dict = Depends(get_dependencies)):
    """
    Returns a list of all available sensor profiles.

    Returns:
        List of profile names
    """
    return device_service.get_profiles(deps["db"])

@router.get("/", response_model=List[DeviceListItem]) # Changed response_model
def get_device_list(deps: Dict = Depends(get_dependencies)):
    """
    Retrieve list of all devices

    Returns:
        List[DeviceListItem]: A list of all devices with their core information.
    """
    devices = device_service.get_list(deps["db"]) 
    return devices

@router.get("/{device_id}", response_model=DeviceResponse)
def get_device_details(device_id: str, deps: Dict = Depends(get_dependencies)):
    """
    Retrieve details of a specific device

    Args:
        device_id: UUID of the device

    Returns:
        DeviceResponse: The device details

    Raises:
        HTTPException: If the device was not found
    """
    result = device_service.get_device(deps["db"], device_id) # Removed None for the unused request parameter
    if result is None:
        raise HTTPException(status_code=404, detail=f"Device with ID {device_id} not found")
    return result


@router.put("/{device_id}", response_model=DeviceResponse)
async def update(device_id: str, device_update: DeviceUpdate, username: str = Depends(admin_auth.get_current_username), deps: Dict = Depends(get_dependencies)):
    """
    Update a specific device

    Args:
        device_id: UUID of the device
        device_update: The device data to update

    Returns:
        DeviceResponse: The updated device details

    Raises:
        HTTPException: If the device was not found or update failed
    """
    # Pass device_id and the Pydantic model device_update directly to the service
    result = device_service.update(deps["db"], device_id, device_update)
    if result is None:
        raise HTTPException(status_code=404, detail=f"Device with ID {device_id} not found or update failed")
    return result


@router.delete("/{device_id}", response_model=dict)
def delete_device(device_id: str, username: str = Depends(admin_auth.get_current_username), deps: Dict = Depends(get_dependencies)):
    """
    Delete a specific device

    Args:
        device_id: UUID of the device

    Returns:
        dict: A success message

    Raises:
        HTTPException: If the device was not found
    """
    result = device_service.delete(deps["db"], device_id)
    if result is None:
        raise HTTPException(status_code=404, detail=f"Device with ID {device_id} not found")
    return {"message": "Device deleted successfully", "device_id": device_id}


@router.post("/", response_model=DeviceResponse, status_code=status.HTTP_201_CREATED)
async def create_device(device: DeviceCreate, username: str = Depends(admin_auth.get_current_username), deps: Dict = Depends(get_dependencies)):
    """
    Create a new device

    Args:
        device: The device data to create

    Returns:
        DeviceResponse: The created device details

    Raises:
        HTTPException: If the device creation failed
    """

    logging.info(f"Creating device with data: {device}")
    try:
        # Assuming there's a create_device function in the device module
        result = device_service.create(deps["db"], device)
        if result is None:
            error_msg = "Failed to create device: 500: Failed to create device"
            logging.error(error_msg)
            raise HTTPException(status_code=500, detail=error_msg)
        return result
    except HTTPException:
        # Re-raise HTTP exceptions without modification
        raise
    except Exception as e:
        logging.error(f"Failed to create device: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create device: {str(e)}")
