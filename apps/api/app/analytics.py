from dataclasses import dataclass
from datetime import UTC, date, datetime
from uuid import UUID

from pydantic import BaseModel, Field


class AnalyticsEventIn(BaseModel):
    destination_id: UUID
    tour_id: UUID | None = None
    visitor_session_id: str = Field(min_length=8, max_length=120)
    event_name: str = Field(min_length=1, max_length=120)
    occurred_at: datetime | None = None
    payload: dict[str, object] = Field(default_factory=dict)


class PilotAnalyticsSummary(BaseModel):
    destination_id: UUID
    tour_id: UUID | None = None
    completed_visitor_experiences: int
    started_visitor_experiences: int
    manual_completions: int
    gps_completions: int
    completion_rate: float


@dataclass(frozen=True)
class CountableAnalyticsEvent:
    destination_id: UUID
    tour_id: UUID | None
    visitor_session_id: str
    event_name: str
    occurred_at: datetime
    payload: dict[str, object]


COMPLETED_VISITOR_EXPERIENCE = "visitor_experience.completed"
STARTED_VISITOR_EXPERIENCE = "visitor_experience.started"


def normalize_analytics_event(event: AnalyticsEventIn) -> CountableAnalyticsEvent:
    occurred_at = event.occurred_at or datetime.now(UTC)
    if occurred_at.tzinfo is None:
        occurred_at = occurred_at.replace(tzinfo=UTC)

    return CountableAnalyticsEvent(
        destination_id=event.destination_id,
        tour_id=event.tour_id,
        visitor_session_id=event.visitor_session_id,
        event_name=event.event_name,
        occurred_at=occurred_at.astimezone(UTC),
        payload=event.payload,
    )


def metric_date_for_event(event: CountableAnalyticsEvent) -> date:
    return event.occurred_at.astimezone(UTC).date()


def completion_method(event: CountableAnalyticsEvent) -> str | None:
    method = event.payload.get("completion_method")
    if method in {"manual", "gps"}:
        return str(method)
    return None


def summarize_pilot_events(events: list[CountableAnalyticsEvent]) -> list[PilotAnalyticsSummary]:
    buckets: dict[tuple[UUID, UUID | None], dict[str, int]] = {}
    for event in events:
        key = (event.destination_id, event.tour_id)
        bucket = buckets.setdefault(
            key,
            {
                "completed": 0,
                "started": 0,
                "manual": 0,
                "gps": 0,
            },
        )
        if event.event_name == STARTED_VISITOR_EXPERIENCE:
            bucket["started"] += 1
        if event.event_name == COMPLETED_VISITOR_EXPERIENCE:
            bucket["completed"] += 1
            method = completion_method(event)
            if method == "manual":
                bucket["manual"] += 1
            if method == "gps":
                bucket["gps"] += 1

    summaries: list[PilotAnalyticsSummary] = []
    for (destination_id, tour_id), bucket in buckets.items():
        started = bucket["started"]
        completed = bucket["completed"]
        completion_rate = round(completed / started, 4) if started else 0.0
        summaries.append(
            PilotAnalyticsSummary(
                destination_id=destination_id,
                tour_id=tour_id,
                completed_visitor_experiences=completed,
                started_visitor_experiences=started,
                manual_completions=bucket["manual"],
                gps_completions=bucket["gps"],
                completion_rate=completion_rate,
            )
        )
    return summaries
