"""add provider-neutral media asset registry"""

import sqlalchemy as sa

from alembic import op

revision = "0004_m4_media_assets"
down_revision = "0003_m3_cms_editorial_state"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "media_assets",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("owner_type", sa.String(length=32), nullable=False),
        sa.Column("owner_id", sa.UUID(), nullable=False),
        sa.Column("storage_key", sa.String(length=500), nullable=False),
        sa.Column("media_type", sa.String(length=32), nullable=False),
        sa.Column("mime_type", sa.String(length=120), nullable=False),
        sa.Column(
            "processing_status", sa.String(length=32), server_default="pending", nullable=False
        ),
        sa.Column("duration_seconds", sa.Integer(), nullable=True),
        sa.Column("alt_text", sa.Text(), server_default="", nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("storage_key"),
    )
    op.create_index("ix_media_assets_owner_type", "media_assets", ["owner_type"])
    op.create_index("ix_media_assets_owner_id", "media_assets", ["owner_id"])


def downgrade() -> None:
    op.drop_index("ix_media_assets_owner_id", table_name="media_assets")
    op.drop_index("ix_media_assets_owner_type", table_name="media_assets")
    op.drop_table("media_assets")
