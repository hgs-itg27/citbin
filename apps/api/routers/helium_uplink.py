from fastapi import APIRouter
from fastapi import Depends, Body
from typing import Dict, Any, Optional
import logging
from api import device_service
from dependencies import get_dependencies
from models.api_models import DeviceResponse, DeviceUpdate, DeviceCreate, DeviceListItem
from modules.process_data import parse_sensor_payload, save_sensor_data

router = APIRouter(
    prefix="/helium",
    tags=["Helium Uplink"]
)

@router.post("/uplink", summary="Receive JSON Uplink Data from Helium")
async def uplink(payload: Dict[str, Any] = Body(...), deps: Dict = Depends(get_dependencies)):
    """
    Receive RAW uplink data from Helium
    """
    parsed = parse_sensor_payload(payload)
    logging.info(f"[DEBUG] Helium Rohdaten empfangen:\n{parsed}")
    save_sensor_data(deps['db'], parsed)

    return {"status": "ok"}