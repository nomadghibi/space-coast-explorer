"""add cms_users table"""

import sqlalchemy as sa

from alembic import op

revision = "0008_cms_users"
down_revision = "0007_m9_pilot_analytics"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "cms_users",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("email", sa.String(length=320), nullable=False),
        sa.Column("hashed_password", sa.String(length=255), nullable=False),
        sa.Column("role", sa.String(length=32), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_cms_users_email", "cms_users", ["email"], unique=True)


def downgrade() -> None:
    op.drop_index("ix_cms_users_email", table_name="cms_users")
    op.drop_table("cms_users")
