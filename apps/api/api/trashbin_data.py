import logging
from typing import Optional, List

from models.api_models import TrashbinDataResponse
from models.trashbin_data import DataLog
from sqlmodel import Session, select

logger = logging.getLogger(__name__)


def get(db, trashbin_data_id: int) -> Optional[TrashbinDataResponse]:
    with Session(db) as session:
        data = session.get(DataLog, trashbin_data_id)
        if data is None:
            return None
        logger.debug("Processing trashbin data GET request with ID: %s", trashbin_data_id)
        return TrashbinDataResponse(
            id=data.id,
            trashbin_id=data.trashbin_id,
            time=data.time,
            distance=data.distance,
            fill_level=data.fill_level,
            payload=data.payload
        )
