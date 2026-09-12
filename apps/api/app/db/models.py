from datetime import datetime
from uuid import UUID

from geoalchemy2 import Geography, Geometry
from sqlalchemy import JSON, DateTime, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import JSONB
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


class AnalyticsEvent(TimestampedUuidMixin, Base):
    __tablename__ = "analytics_events"

    event_name: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    payload: Mapped[dict[str, object]] = mapped_column(json_payload, nullable=False)


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
