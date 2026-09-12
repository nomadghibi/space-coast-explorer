"""m2 geospatial tours

Revision ID: 0002_m2_geospatial_tours
Revises: 0001_m0_foundation
Create Date: 2026-09-12 14:00:00.000000
"""

from collections.abc import Sequence

import geoalchemy2
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

revision: str = "0002_m2_geospatial_tours"
down_revision: str | None = "0001_m0_foundation"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.execute('CREATE EXTENSION IF NOT EXISTS "postgis"')
    op.create_table(
        "tours",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("destination_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("slug", sa.String(length=160), nullable=False),
        sa.Column("title", sa.String(length=240), nullable=False),
        sa.Column("summary", sa.Text(), nullable=False),
        sa.Column(
            "route_geometry",
            geoalchemy2.Geometry(geometry_type="LINESTRING", srid=4326),
            nullable=True,
        ),
        sa.ForeignKeyConstraint(["destination_id"], ["destinations.id"]),
    )
    op.create_index("ix_tours_destination_id", "tours", ["destination_id"])
    op.create_index("ix_tours_slug", "tours", ["slug"])
    op.create_table(
        "tour_stops",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("tour_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("slug", sa.String(length=160), nullable=False),
        sa.Column("sequence", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(length=240), nullable=False),
        sa.Column("summary", sa.Text(), nullable=False),
        sa.Column(
            "location",
            geoalchemy2.Geography(geometry_type="POINT", srid=4326),
            nullable=False,
        ),
        sa.Column("trigger_radius_meters", sa.Integer(), nullable=False, server_default="35"),
        sa.Column("exit_radius_meters", sa.Integer(), nullable=False, server_default="60"),
        sa.ForeignKeyConstraint(["tour_id"], ["tours.id"]),
        sa.UniqueConstraint("tour_id", "sequence", name="uq_tour_stops_tour_sequence"),
        sa.UniqueConstraint("tour_id", "slug", name="uq_tour_stops_tour_slug"),
    )
    op.create_index("ix_tour_stops_tour_id", "tour_stops", ["tour_id"])
    op.create_index("ix_tour_stops_slug", "tour_stops", ["slug"])
    op.create_index("ix_tour_stops_location", "tour_stops", ["location"], postgresql_using="gist")


def downgrade() -> None:
    op.drop_index("ix_tour_stops_location", table_name="tour_stops")
    op.drop_index("ix_tour_stops_slug", table_name="tour_stops")
    op.drop_index("ix_tour_stops_tour_id", table_name="tour_stops")
    op.drop_table("tour_stops")
    op.drop_index("ix_tours_slug", table_name="tours")
    op.drop_index("ix_tours_destination_id", table_name="tours")
    op.drop_table("tours")
