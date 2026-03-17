import uuid
from typing import Dict, Any, Optional
from sqlmodel import SQLModel, Field
from models.api_models import DeviceCreate, DeviceUpdate


class Device(SQLModel, table=True):
    """Class representing a device"""
    id: str = Field(primary_key=True)
    devEui: Optional[str] = None
    trashbin_id: Optional[str] = None
    deviceProfileName: Optional[str] = None
    battery_level: Optional[int] = None
    last_seen: Optional[str] = None
    latest_data_id: Optional[int] = None
    
    # Additional fields can be added through proper SQLModel fields
    # rather than using ConfigDict(extra="allow")

    def to_dict(self) -> Dict[str, Any]:
        """Converts the device to a dictionary"""
        return {
            "id": self.id,
            "devEui": self.devEui,
            "trashbin_id": self.trashbin_id,
            "deviceProfileName": self.deviceProfileName,
            "battery_level": self.battery_level,
            "last_seen": self.last_seen,
            "latest_data_id": self.latest_data_id
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Device':
        """Creates a device from a dictionary"""
        return cls(**data)

    @classmethod
    def from_device_create(cls, deviceCreate: 'DeviceCreate') -> 'Device':
        """Creates a device from a DeviceCreate object"""
        return cls(
            id=str(uuid.uuid4()),
            devEui=deviceCreate.devEui,
            trashbin_id=deviceCreate.trashbin_id,
        )

    @classmethod
    def from_device_update(cls, deviceUpdate: 'DeviceUpdate') -> 'Device':
        """Creates a device from a DeviceUpdate object"""
        return cls(
            id=deviceUpdate.id,
            devEui=deviceUpdate.devEui,
            trashbin_id=deviceUpdate.trashbin_id,
            deviceProfileName=deviceUpdate.deviceProfileName,
            battery_level=deviceUpdate.battery_level,
            last_seen=deviceUpdate.last_seen,
            latest_data_id=deviceUpdate.latest_data_id
        )

    def update(self, data) -> None:
        """Updates the attributes of the device"""
        # If data is a Device object, we need to extract its attributes
        if isinstance(data, Device):
            for key, value in data.__dict__.items():
                if key != 'id' and hasattr(self, key):  # ID cannot be changed
                    setattr(self, key, value)
        # If data is a dictionary
        elif isinstance(data, dict):
            for key, value in data.items():
                if key != 'id' and hasattr(self, key):  # ID cannot be changed
                    setattr(self, key, value)
        else:
            raise TypeError(f"Cannot update from type {type(data)}")
