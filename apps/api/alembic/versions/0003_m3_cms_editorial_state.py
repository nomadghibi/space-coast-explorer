"""add CMS editorial state"""

import sqlalchemy as sa

from alembic import op

revision = "0003_m3_cms_editorial_state"
down_revision = "0002_m2_geospatial_tours"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "tours",
        sa.Column("editorial_status", sa.String(length=32), nullable=False, server_default="draft"),
    )
    op.add_column("tours", sa.Column("published_at", sa.DateTime(timezone=True), nullable=True))
    op.create_index("ix_tours_editorial_status", "tours", ["editorial_status"])


def downgrade() -> None:
    op.drop_index("ix_tours_editorial_status", table_name="tours")
    op.drop_column("tours", "published_at")
    op.drop_column("tours", "editorial_status")
