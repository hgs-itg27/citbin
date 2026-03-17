from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from pydantic import ConfigDict

class DeviceBase(BaseModel):
    id: str = Field(..., description="Unique DB ID")
    devEui: Optional[str] = Field(None, description="Unique LoRa ID")
    trashbin_id: Optional[str] = Field(None, description="DB ID of Trashbin the Device is assigned to")
    
    model_config = ConfigDict(from_attributes=True)
    
    def model_dump(self, **kwargs) -> Dict[str, Any]:
        """Compatibility method for Pydantic v2"""
        if hasattr(super(), "model_dump"):
            return super().model_dump(**kwargs)
        return self.dict(**kwargs)
    
    def model_copy(self, **kwargs) -> BaseModel:
        """Compatibility method for Pydantic v2"""
        if hasattr(super(), "model_copy"):
            return super().model_copy(**kwargs)
        return self.copy(**kwargs)

class DeviceListItem(DeviceBase):
    battery_level: Optional[int] = Field(None, description="Current battery level (0-100)")
    last_seen: Optional[str] = Field(None, description="ISO formatted timestamp of last communication")
    latest_data_id: Optional[int] = Field(None, description="DB ID of latest device data")

class DeviceCreate(BaseModel):
    """Model for creating a new device"""
    devEui: Optional[str] = Field(None, description="Unique LoRa ID")
    trashbin_id: Optional[str] = Field(None, description="DB ID of Trashbin the Device is assigned to")
    
    model_config = ConfigDict(from_attributes=True)
    
    def model_dump(self, **kwargs) -> Dict[str, Any]:
        """Compatibility method for Pydantic v2"""
        if hasattr(super(), "model_dump"):
            return super().model_dump(**kwargs)
        return self.dict(**kwargs)
    
    def model_copy(self, **kwargs) -> BaseModel:
        """Compatibility method for Pydantic v2"""
        if hasattr(super(), "model_copy"):
            return super().model_copy(**kwargs)
        return self.copy(**kwargs)

class DeviceUpdate(DeviceBase):
    """Model for updating an existing device"""
    deviceProfileName: Optional[str] = Field(None, description="Device Profile Name of the device")
    battery_level: Optional[int] = Field(None, ge=0, le=100, description="Current battery level (0-100)")
    last_seen: Optional[str] = Field(None, description="ISO formatted timestamp of last communication")
    latest_data_id: Optional[int] = Field(None, description="DB ID of latest device data")

class DeviceResponse(DeviceBase):
    """Model for device response data"""
    deviceProfileName: Optional[str] = Field(None, description="Device Profile Name of the device")
    battery_level: Optional[int] = Field(None, ge=0, le=100, description="Current battery level (0-100)")
    last_seen: Optional[str] = Field(None, description="ISO formatted timestamp of last communication")
    latest_data_id: Optional[int] = Field(None, description="DB ID of latest device data")

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra = {
            "example": {
                "id": "550e8400-e29b-41d4-a716-446655440000",
                "devEui": "24e124713e112510",
                "trashbin_id" :"31293840-e67b-4ad4-1236-446655412300",
                "deviceProfileName": "MIL-EM310-UDL",
                "battery_level": 87,
                "last_seen": "2023-04-25T10:30:00",
                "latest_data_id": 183
            }
        }
    )


class TrashbinListItem(BaseModel):
    id: str = Field(..., description="Unique ID for the trashbin")
    name: str = Field(..., description="Name of the trashbin")
    type: str = Field(..., description="Type of trashbin")
    location: str = Field(..., description="Location of trashbin")
    status: Optional[str] = Field(None, description="Status like active, maintenance, ...")
    latitude: float = Field(..., description="Latitude of the trashbin")
    longitude: float = Field(..., description="Longitude of the trashbin")
    has_device: bool = Field(..., description="Boolean whether trashbin has a sensor assigned to it")
    latest_data_id: Optional[int] = Field(None, description='ID of latest update data')
    latest_fill_level: Optional[int] = Field(None, description='Latest fill level')
    
    model_config = ConfigDict(from_attributes=True)
    
    def model_dump(self, **kwargs) -> Dict[str, Any]:
        """Compatibility method for Pydantic v2"""
        if hasattr(super(), "model_dump"):
            return super().model_dump(**kwargs)
        return self.dict(**kwargs)
    
    def model_copy(self, **kwargs) -> BaseModel:
        """Compatibility method for Pydantic v2"""
        if hasattr(super(), "model_copy"):
            return super().model_copy(**kwargs)
        return self.copy(**kwargs)

class TrashbinBase(BaseModel):
    name: str = Field(..., description="Name of the trashbin")
    type: str = Field(..., description="Type of trashbin")
    location: str = Field(..., description="Location of trashbin")
    status: Optional[str] = Field(..., description="Status like active, maintenance, ...")
    latitude: Optional[float] = Field(None, description="Latitude of the trashbin")
    longitude: Optional[float] = Field(None, description="Longitude of the trashbin")
    
    model_config = ConfigDict(from_attributes=True)
    
    def model_dump(self, **kwargs) -> Dict[str, Any]:
        """Compatibility method for Pydantic v2"""
        if hasattr(super(), "model_dump"):
            return super().model_dump(**kwargs)
        return self.dict(**kwargs)
    
    def model_copy(self, **kwargs) -> BaseModel:
        """Compatibility method for Pydantic v2"""
        if hasattr(super(), "model_copy"):
            return super().model_copy(**kwargs)
        return self.copy(**kwargs)


class TrashbinCreate(TrashbinBase):
    ...


class TrashbinUpdate(TrashbinBase):
    id: str = Field(..., description="Unique ID for the trashbin")
    last_update_time: Optional[str] = Field(None, description='Datetime of last update')
    latest_data_id: Optional[int] = Field(None, description='Id of latest update data')
    latest_fill_level: Optional[int] = Field(None, description='Latest fill level')


class TrashbinResponse(TrashbinBase):
    id: str = Field(..., description="Unique ID for the trashbin")
    last_update_time: Optional[str] = Field(None, description='Datetime of last update')
    latest_data_id: Optional[int] = Field(None, description='Id of latest update data')
    latest_fill_level: Optional[int] = Field(None, description='Latest fill level')


class TrashbinDataResponse(BaseModel):
    id: int = Field(..., description="Unique ID for the collected data")
    trashbin_id: str = Field(..., description="Id of the trashbin")
    time: str = Field(..., description="Time when data was collected")
    distance: Optional[float] = Field(None, description='Measured distance')
    fill_level: Optional[float] = Field(None, description='Calculated level')
    payload: Optional[str] = Field(None, description='Jsonified sensor data payload')
    
    model_config = ConfigDict(from_attributes=True)
    
    def model_dump(self, **kwargs) -> Dict[str, Any]:
        """Compatibility method for Pydantic v2"""
        if hasattr(super(), "model_dump"):
            return super().model_dump(**kwargs)
        return self.dict(**kwargs)
    
    def model_copy(self, **kwargs) -> BaseModel:
        """Compatibility method for Pydantic v2"""
        if hasattr(super(), "model_copy"):
            return super().model_copy(**kwargs)
        return self.copy(**kwargs)