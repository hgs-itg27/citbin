"""custom migration for type conversion

Revision ID: custom_migration
Revises: 
Create Date: 2025-05-06

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
import sqlmodel

# revision identifiers, used by Alembic.
revision = 'custom_migration'
down_revision = None
branch_labels = None
depends_on = None

def upgrade() -> None:
    # Create tables from scratch instead of altering existing ones
    
    # Create device table
    op.create_table('device',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('name', sa.String(), nullable=True),
        sa.Column('deviceProfileName', sa.String(), nullable=True),
        sa.Column('location', sa.String(), nullable=True),
        sa.Column('battery_level', sa.Integer(), nullable=True),
        sa.Column('firmware_version', sa.String(), nullable=True),
        sa.Column('last_seen', sa.String(), nullable=True),
        sa.Column('status', sa.String(), nullable=True),
        sa.Column('latest_data_id', sa.Integer(), nullable=True),
        sa.Column('devEui', sa.String(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create trashbin table
    op.create_table('trashbin',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('location', sa.String(), nullable=False),
        sa.Column('type', sa.String(), nullable=True),
        sa.Column('latitude', sa.Float(), nullable=True),
        sa.Column('longitude', sa.Float(), nullable=True),
        sa.Column('latest_data_id', sa.Integer(), nullable=True),
        sa.Column('last_update_time', sa.String(), nullable=True),
        sa.Column('device_id', sa.String(), nullable=True),
        sa.ForeignKeyConstraint(['device_id'], ['device.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create datalog table
    op.create_table('datalog',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('time', sa.String(), nullable=False),
        sa.Column('trashbin_id', sa.String(), nullable=False),
        sa.Column('fill_level', sa.Integer(), nullable=True),
        sa.Column('distance', sa.Float(), nullable=True),
        sa.ForeignKeyConstraint(['trashbin_id'], ['trashbin.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

def downgrade() -> None:
    op.drop_table('datalog')
    op.drop_table('trashbin')
    op.drop_table('device')
