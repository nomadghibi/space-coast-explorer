"""add provider-neutral billing records"""
# ruff: noqa: E501

import sqlalchemy as sa

from alembic import op

revision = "0006_m8_billing"
down_revision = "0005_m7_merchants"
branch_labels = None
depends_on = None


def upgrade() -> None:
    common = [sa.Column("id", sa.UUID(), nullable=False), sa.Column("created_at", sa.DateTime(timezone=True), nullable=False), sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False)]
    op.create_table("billing_plans", *common, sa.Column("code", sa.String(80), nullable=False), sa.Column("name", sa.String(160), nullable=False), sa.Column("currency", sa.String(3), server_default="USD", nullable=False), sa.Column("unit_amount_cents", sa.Integer(), nullable=False), sa.Column("active", sa.Boolean(), server_default=sa.true(), nullable=False), sa.PrimaryKeyConstraint("id"), sa.UniqueConstraint("code"))  # type: ignore[arg-type]
    op.create_table("subscriptions", *common, sa.Column("organization_id", sa.UUID(), nullable=False), sa.Column("plan_id", sa.UUID(), nullable=False), sa.Column("provider", sa.String(40), server_default="not_configured", nullable=False), sa.Column("provider_reference", sa.String(240), nullable=True), sa.Column("status", sa.String(32), server_default="pending", nullable=False), sa.ForeignKeyConstraint(["organization_id"], ["organizations.id"]), sa.ForeignKeyConstraint(["plan_id"], ["billing_plans.id"]), sa.PrimaryKeyConstraint("id"))  # type: ignore[arg-type]
    op.create_index("ix_subscriptions_organization_id", "subscriptions", ["organization_id"])
    op.create_index("ix_subscriptions_plan_id", "subscriptions", ["plan_id"])
    op.create_table("invoices", *common, sa.Column("subscription_id", sa.UUID(), nullable=False), sa.Column("amount_cents", sa.Integer(), nullable=False), sa.Column("currency", sa.String(3), server_default="USD", nullable=False), sa.Column("status", sa.String(32), server_default="draft", nullable=False), sa.ForeignKeyConstraint(["subscription_id"], ["subscriptions.id"]), sa.PrimaryKeyConstraint("id"))  # type: ignore[arg-type]
    op.create_index("ix_invoices_subscription_id", "invoices", ["subscription_id"])


def downgrade() -> None:
    op.drop_table("invoices")
    op.drop_table("subscriptions")
    op.drop_table("billing_plans")
