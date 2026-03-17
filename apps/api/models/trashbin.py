from sqlmodel import SQLModel, Field
import uuid
from typing import Optional
from models.api_models import TrashbinCreate, TrashbinUpdate


class Trashbin(SQLModel, table=True):
    """Class representing a Trashbin"""
    id: str = Field(primary_key=True)
    name: str
    type: str
    location: str
    status: Optional[str]
    latitude: Optional[float]  # Geo-coordinates
    longitude: Optional[float]  # Geo-coordinates
    last_update_time: Optional[str]
    latest_data_id: Optional[int]
    latest_fill_level: Optional[int]

    def to_dict(self):
        return self.model_dump()

    @classmethod
    def from_dict(cls, kwargs):
        return cls(**kwargs)

    @classmethod
    def from_api_create(cls, trashbin_create: TrashbinCreate):
        return cls(
            id=str(uuid.uuid4()),
            name=trashbin_create.name,
            type=trashbin_create.type,
            location=trashbin_create.location,
            status=trashbin_create.status,
            latitude=trashbin_create.latitude,
            longitude=trashbin_create.longitude
        )

    def api_update(self, trashbin_id, trashbin_update: TrashbinUpdate):
        self.id=trashbin_id
        self.name=trashbin_update.name
        self.type=trashbin_update.type
        self.location=trashbin_update.location
        self.status=trashbin_update.status
        self.latitude=trashbin_update.latitude
        self.longitude=trashbin_update.longitude,
        self.last_update_time=trashbin_update.last_update_time,
        self.latest_data_id=trashbin_update.latest_data_id
