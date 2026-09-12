from datetime import date, datetime
from uuid import UUID

from geoalchemy2 import Geography, Geometry
from sqlalchemy import JSON, Date, DateTime, ForeignKey, String, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.dialects.postgresql import UUID as PgUUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, TimestampedUuidMixin

json_payload = JSON().with_variant(JSONB, "postgresql")


class Organization(TimestampedUuidMixin, Base):
    __tablename__ = "organizations"

    name: Mapped[str] = mapped_column(String(200), nullable=False)
    slug: Mapped[str] = mapped_column(String(120), nullable=False, unique=True, index=True)


class Destination(TimestampedUuidMixin, Base):
    __tablename__ = "destinations"

    organization_id: Mapped[UUID] = mapped_column(ForeignKey("organizations.id"), index=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    slug: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    summary: Mapped[str] = mapped_column(Text, nullable=False, default="")


class Tour(TimestampedUuidMixin, Base):
    __tablename__ = "tours"

    destination_id: Mapped[UUID] = mapped_column(ForeignKey("destinations.id"), index=True)
    slug: Mapped[str] = mapped_column(String(160), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(240), nullable=False)
    summary: Mapped[str] = mapped_column(Text, nullable=False, default="")
    editorial_status: Mapped[str] = mapped_column(String(32), nullable=False, default="draft")
    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    route_geometry: Mapped[object | None] = mapped_column(
        Geometry("LINESTRING", srid=4326), nullable=True
    )


class TourStop(TimestampedUuidMixin, Base):
    __tablename__ = "tour_stops"

    tour_id: Mapped[UUID] = mapped_column(ForeignKey("tours.id"), index=True)
    slug: Mapped[str] = mapped_column(String(160), nullable=False, index=True)
    sequence: Mapped[int] = mapped_column(nullable=False)
    title: Mapped[str] = mapped_column(String(240), nullable=False)
    summary: Mapped[str] = mapped_column(Text, nullable=False, default="")
    location: Mapped[object] = mapped_column(Geography("POINT", srid=4326), nullable=False)
    trigger_radius_meters: Mapped[int] = mapped_column(nullable=False, default=35)
    exit_radius_meters: Mapped[int] = mapped_column(nullable=False, default=60)


class MediaAsset(TimestampedUuidMixin, Base):
    __tablename__ = "media_assets"

    owner_type: Mapped[str] = mapped_column(String(32), nullable=False, index=True)
    owner_id: Mapped[UUID] = mapped_column(PgUUID(as_uuid=True), nullable=False, index=True)
    storage_key: Mapped[str] = mapped_column(String(500), nullable=False, unique=True)
    media_type: Mapped[str] = mapped_column(String(32), nullable=False)
    mime_type: Mapped[str] = mapped_column(String(120), nullable=False)
    processing_status: Mapped[str] = mapped_column(String(32), nullable=False, default="pending")
    duration_seconds: Mapped[int | None] = mapped_column(nullable=True)
    alt_text: Mapped[str] = mapped_column(Text, nullable=False, default="")


class Merchant(TimestampedUuidMixin, Base):
    __tablename__ = "merchants"

    organization_id: Mapped[UUID] = mapped_column(ForeignKey("organizations.id"), index=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    status: Mapped[str] = mapped_column(String(32), nullable=False, default="pending")


class Business(TimestampedUuidMixin, Base):
    __tablename__ = "businesses"

    destination_id: Mapped[UUID] = mapped_column(ForeignKey("destinations.id"), index=True)
    name: Mapped[str] = mapped_column(String(240), nullable=False)
    slug: Mapped[str] = mapped_column(String(160), nullable=False, index=True)
    status: Mapped[str] = mapped_column(String(32), nullable=False, default="unclaimed")


class BusinessClaim(TimestampedUuidMixin, Base):
    __tablename__ = "business_claims"

    business_id: Mapped[UUID] = mapped_column(ForeignKey("businesses.id"), index=True)
    merchant_id: Mapped[UUID] = mapped_column(ForeignKey("merchants.id"), index=True)
    status: Mapped[str] = mapped_column(String(32), nullable=False, default="submitted")
    review_note: Mapped[str] = mapped_column(Text, nullable=False, default="")


class BillingPlan(TimestampedUuidMixin, Base):
    __tablename__ = "billing_plans"

    code: Mapped[str] = mapped_column(String(80), nullable=False, unique=True)
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), nullable=False, default="USD")
    unit_amount_cents: Mapped[int] = mapped_column(nullable=False)
    active: Mapped[bool] = mapped_column(nullable=False, default=True)


class Subscription(TimestampedUuidMixin, Base):
    __tablename__ = "subscriptions"

    organization_id: Mapped[UUID] = mapped_column(ForeignKey("organizations.id"), index=True)
    plan_id: Mapped[UUID] = mapped_column(ForeignKey("billing_plans.id"), index=True)
    provider: Mapped[str] = mapped_column(String(40), nullable=False, default="not_configured")
    provider_reference: Mapped[str | None] = mapped_column(String(240), nullable=True)
    status: Mapped[str] = mapped_column(String(32), nullable=False, default="pending")


class Invoice(TimestampedUuidMixin, Base):
    __tablename__ = "invoices"

    subscription_id: Mapped[UUID] = mapped_column(ForeignKey("subscriptions.id"), index=True)
    amount_cents: Mapped[int] = mapped_column(nullable=False)
    currency: Mapped[str] = mapped_column(String(3), nullable=False, default="USD")
    status: Mapped[str] = mapped_column(String(32), nullable=False, default="draft")


class AnalyticsEvent(TimestampedUuidMixin, Base):
    __tablename__ = "analytics_events"

    destination_id: Mapped[UUID] = mapped_column(ForeignKey("destinations.id"), index=True)
    tour_id: Mapped[UUID | None] = mapped_column(ForeignKey("tours.id"), nullable=True, index=True)
    visitor_session_id: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    event_name: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    occurred_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    payload: Mapped[dict[str, object]] = mapped_column(json_payload, nullable=False)


class PilotDailyMetric(TimestampedUuidMixin, Base):
    __tablename__ = "pilot_daily_metrics"
    __table_args__ = (
        UniqueConstraint("destination_id", "tour_id", "metric_date", name="uq_pilot_daily_metric"),
    )

    destination_id: Mapped[UUID] = mapped_column(ForeignKey("destinations.id"), index=True)
    tour_id: Mapped[UUID | None] = mapped_column(ForeignKey("tours.id"), nullable=True, index=True)
    metric_date: Mapped[date] = mapped_column(Date(), nullable=False, index=True)
    completed_visitor_experiences: Mapped[int] = mapped_column(nullable=False, default=0)
    started_visitor_experiences: Mapped[int] = mapped_column(nullable=False, default=0)
    manual_completions: Mapped[int] = mapped_column(nullable=False, default=0)
    gps_completions: Mapped[int] = mapped_column(nullable=False, default=0)


class Job(TimestampedUuidMixin, Base):
    __tablename__ = "jobs"

    job_type: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    status: Mapped[str] = mapped_column(String(60), nullable=False, default="pending")
    payload: Mapped[dict[str, object]] = mapped_column(json_payload, nullable=False)


class OutboxEvent(TimestampedUuidMixin, Base):
    __tablename__ = "outbox_events"

    event_type: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    payload: Mapped[dict[str, object]] = mapped_column(json_payload, nullable=False)
    status: Mapped[str] = mapped_column(String(60), nullable=False, default="pending")
