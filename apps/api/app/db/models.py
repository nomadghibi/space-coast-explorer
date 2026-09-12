from uuid import UUID

from sqlalchemy import JSON, ForeignKey, String, Text
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
