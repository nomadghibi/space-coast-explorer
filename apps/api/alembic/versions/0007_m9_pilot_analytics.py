"""add pilot analytics reporting columns"""

import sqlalchemy as sa

from alembic import op

revision = "0007_m9_pilot_analytics"
down_revision = "0006_m8_billing"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("analytics_events", sa.Column("destination_id", sa.UUID(), nullable=True))
    op.add_column("analytics_events", sa.Column("tour_id", sa.UUID(), nullable=True))
    op.add_column(
        "analytics_events",
        sa.Column("visitor_session_id", sa.String(length=120), nullable=True),
    )
    op.add_column(
        "analytics_events", sa.Column("occurred_at", sa.DateTime(timezone=True), nullable=True)
    )
    op.create_foreign_key(
        "fk_analytics_events_destination_id_destinations",
        "analytics_events",
        "destinations",
        ["destination_id"],
        ["id"],
    )
    op.create_foreign_key(
        "fk_analytics_events_tour_id_tours",
        "analytics_events",
        "tours",
        ["tour_id"],
        ["id"],
    )
    op.create_index(
        "ix_analytics_events_destination_id", "analytics_events", ["destination_id"]
    )
    op.create_index("ix_analytics_events_tour_id", "analytics_events", ["tour_id"])
    op.create_index(
        "ix_analytics_events_visitor_session_id",
        "analytics_events",
        ["visitor_session_id"],
    )
    op.create_index("ix_analytics_events_occurred_at", "analytics_events", ["occurred_at"])

    op.create_table(
        "pilot_daily_metrics",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("destination_id", sa.UUID(), nullable=False),
        sa.Column("tour_id", sa.UUID(), nullable=True),
        sa.Column("metric_date", sa.Date(), nullable=False),
        sa.Column("completed_visitor_experiences", sa.Integer(), nullable=False),
        sa.Column("started_visitor_experiences", sa.Integer(), nullable=False),
        sa.Column("manual_completions", sa.Integer(), nullable=False),
        sa.Column("gps_completions", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(["destination_id"], ["destinations.id"]),
        sa.ForeignKeyConstraint(["tour_id"], ["tours.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint(
            "destination_id", "tour_id", "metric_date", name="uq_pilot_daily_metric"
        ),
    )
    op.create_index(
        "ix_pilot_daily_metrics_destination_id",
        "pilot_daily_metrics",
        ["destination_id"],
    )
    op.create_index("ix_pilot_daily_metrics_tour_id", "pilot_daily_metrics", ["tour_id"])
    op.create_index(
        "ix_pilot_daily_metrics_metric_date",
        "pilot_daily_metrics",
        ["metric_date"],
    )


def downgrade() -> None:
    op.drop_table("pilot_daily_metrics")
    op.drop_index("ix_analytics_events_occurred_at", table_name="analytics_events")
    op.drop_index("ix_analytics_events_visitor_session_id", table_name="analytics_events")
    op.drop_index("ix_analytics_events_tour_id", table_name="analytics_events")
    op.drop_index("ix_analytics_events_destination_id", table_name="analytics_events")
    op.drop_constraint(
        "fk_analytics_events_tour_id_tours", "analytics_events", type_="foreignkey"
    )
    op.drop_constraint(
        "fk_analytics_events_destination_id_destinations",
        "analytics_events",
        type_="foreignkey",
    )
    op.drop_column("analytics_events", "occurred_at")
    op.drop_column("analytics_events", "visitor_session_id")
    op.drop_column("analytics_events", "tour_id")
    op.drop_column("analytics_events", "destination_id")
