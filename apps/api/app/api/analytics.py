from uuid import UUID

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.analytics import (
    AnalyticsEventIn,
    PilotAnalyticsSummary,
    normalize_analytics_event,
    summarize_pilot_events,
)
from app.db.models import AnalyticsEvent
from app.db.session import get_session

router = APIRouter(prefix="/api/v1/analytics", tags=["analytics"])
SessionDependency = Depends(get_session)


class AnalyticsEventResponse(BaseModel):
    id: UUID


@router.post("/events", response_model=AnalyticsEventResponse, status_code=201)
def record_event(
    event_in: AnalyticsEventIn, session: Session = SessionDependency
) -> AnalyticsEventResponse:
    event = normalize_analytics_event(event_in)
    record = AnalyticsEvent(
        destination_id=event.destination_id,
        tour_id=event.tour_id,
        visitor_session_id=event.visitor_session_id,
        event_name=event.event_name,
        occurred_at=event.occurred_at,
        payload=event.payload,
    )
    session.add(record)
    session.commit()
    session.refresh(record)
    return AnalyticsEventResponse(id=record.id)


@router.get("/pilot-summary/{destination_id}", response_model=list[PilotAnalyticsSummary])
def get_pilot_summary(
    destination_id: UUID, session: Session = SessionDependency
) -> list[PilotAnalyticsSummary]:
    rows = session.scalars(
        select(AnalyticsEvent).where(AnalyticsEvent.destination_id == destination_id)
    ).all()
    events = [
        normalize_analytics_event(
            AnalyticsEventIn(
                destination_id=row.destination_id,
                tour_id=row.tour_id,
                visitor_session_id=row.visitor_session_id,
                event_name=row.event_name,
                occurred_at=row.occurred_at,
                payload=row.payload,
            )
        )
        for row in rows
    ]
    return summarize_pilot_events(events)
