from fastapi import APIRouter
from fastapi import Depends, HTTPException
from typing import List
import logging
from api import trashbin_service, device_service
from dependencies import get_dependencies
from models.api_models import TrashbinListItem, TrashbinCreate, TrashbinUpdate, TrashbinResponse, DeviceListItem
import modules.admin_auth as admin_auth

router = APIRouter(
    prefix="/trashbin",
    tags=["Trashbins"]
)

@router.get('/types', response_model=List[str])
def get_profiles():
    """
    Returns a list of all available trashbin types.
    
    Returns:
        List of types
    """
    return trashbin_service.get_profiles()

@router.get("/", response_model=List[TrashbinListItem])
def get_list(deps=Depends(get_dependencies)):
    return trashbin_service.get_list(deps['db'])


@router.get('/{trashbin_id}', response_model=TrashbinResponse)
def get(trashbin_id: str, deps=Depends(get_dependencies)):
    return trashbin_service.get(deps['db'], trashbin_id)


@router.get('/{trashbin_id}/device', response_model=List[DeviceListItem])
def get_devices(trashbin_id: str, deps=Depends(get_dependencies)):
    trashbin = trashbin_service.get(deps['db'], trashbin_id)
    if trashbin is None:
        raise HTTPException(status_code=404, detail=f"Trashbin with ID {trashbin_id} not found")
    else:
        device_list = device_service.get_devices_of_trashbin(deps['db'], trashbin_id)
        if device_list is None:
            raise HTTPException(status_code=404, detail=f"No Devices for trashbin ID {trashbin_id} not found")
        else:
            return device_list


@router.post('/', response_model=TrashbinResponse)
def create(trashbin_create: TrashbinCreate, username: str = Depends(admin_auth.get_current_username), deps=Depends(get_dependencies)):
    return trashbin_service.create(deps['db'], trashbin_create)


@router.put('/{trashbin_id}', response_model=TrashbinResponse)
def update(trashbin_id: str, trashbin_update: TrashbinUpdate, username: str = Depends(admin_auth.get_current_username), deps=Depends(get_dependencies)):
    return trashbin_service.update(deps['db'], trashbin_id, trashbin_update)


@router.delete('/{trashbin_id}', response_model=dict)
def delete(trashbin_id: str, username: str = Depends(admin_auth.get_current_username), deps=Depends(get_dependencies)):
    return trashbin_service.delete(deps['db'], trashbin_id)

