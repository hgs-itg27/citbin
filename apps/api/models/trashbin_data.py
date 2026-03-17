from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional


class DataLog(SQLModel, table=True):
    """Stores all incoming data"""
    id: int | None = Field(default=None, primary_key=True)  # autoincrement if no id is given
    trashbin_id: str
    time: str
    payload: Optional[str]
    distance: Optional[int]
    fill_level: Optional[int]
