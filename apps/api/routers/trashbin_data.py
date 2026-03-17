from fastapi import APIRouter
from fastapi import status, Depends, HTTPException
from typing import Dict, List
import logging
from api import trashbin_data
from dependencies import get_dependencies
from models.api_models import TrashbinDataResponse

router = APIRouter(
    prefix="/trashbin_data",
    tags=["Trashbin Data"]
)

@router.get('/{trashbin_data_id}', response_model=TrashbinDataResponse)
def get(trashbin_data_id: str, deps=Depends(get_dependencies)):
    return trashbin_data.get(deps['db'], trashbin_data_id)