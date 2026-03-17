"""geo-coordinates

Revision ID: ee83206bb79f
Revises: custom_migration
Create Date: 2025-05-06 18:02:10.062762

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision: str = 'ee83206bb79f'
down_revision: Union[str, None] = 'custom_migration'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # This migration is now empty because we've incorporated all changes
    # into the custom_migration.py file
    pass


def downgrade() -> None:
    pass
