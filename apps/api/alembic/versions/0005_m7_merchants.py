"""add tenant-scoped merchant claim foundation"""
# The table declarations stay grouped to make the migration schema easy to audit.
# ruff: noqa: E501

import sqlalchemy as sa

from alembic import op

revision = "0005_m7_merchants"
down_revision = "0004_m4_media_assets"
branch_labels = None
depends_on = None


def upgrade() -> None:
    common = [
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    ]
    op.create_table("merchants", *common, sa.Column("organization_id", sa.UUID(), nullable=False), sa.Column("name", sa.String(200), nullable=False), sa.Column("status", sa.String(32), server_default="pending", nullable=False), sa.ForeignKeyConstraint(["organization_id"], ["organizations.id"]), sa.PrimaryKeyConstraint("id"))  # type: ignore[arg-type]
    op.create_index("ix_merchants_organization_id", "merchants", ["organization_id"])
    op.create_table("businesses", *common, sa.Column("destination_id", sa.UUID(), nullable=False), sa.Column("name", sa.String(240), nullable=False), sa.Column("slug", sa.String(160), nullable=False), sa.Column("status", sa.String(32), server_default="unclaimed", nullable=False), sa.ForeignKeyConstraint(["destination_id"], ["destinations.id"]), sa.PrimaryKeyConstraint("id"))  # type: ignore[arg-type]
    op.create_index("ix_businesses_destination_id", "businesses", ["destination_id"])
    op.create_index("ix_businesses_slug", "businesses", ["slug"])
    op.create_table("business_claims", *common, sa.Column("business_id", sa.UUID(), nullable=False), sa.Column("merchant_id", sa.UUID(), nullable=False), sa.Column("status", sa.String(32), server_default="submitted", nullable=False), sa.Column("review_note", sa.Text(), server_default="", nullable=False), sa.ForeignKeyConstraint(["business_id"], ["businesses.id"]), sa.ForeignKeyConstraint(["merchant_id"], ["merchants.id"]), sa.PrimaryKeyConstraint("id"))  # type: ignore[arg-type]
    op.create_index("ix_business_claims_business_id", "business_claims", ["business_id"])
    op.create_index("ix_business_claims_merchant_id", "business_claims", ["merchant_id"])


def downgrade() -> None:
    op.drop_table("business_claims")
    op.drop_table("businesses")
    op.drop_table("merchants")
