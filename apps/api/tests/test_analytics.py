from datetime import UTC, datetime
from uuid import uuid4

from app.analytics import (
    COMPLETED_VISITOR_EXPERIENCE,
    STARTED_VISITOR_EXPERIENCE,
    AnalyticsEventIn,
    metric_date_for_event,
    normalize_analytics_event,
    summarize_pilot_events,
)


def test_normalize_event_uses_utc_and_metric_date() -> None:
    event = normalize_analytics_event(
        AnalyticsEventIn(
            destination_id=uuid4(),
            visitor_session_id="session-123",
            event_name=STARTED_VISITOR_EXPERIENCE,
            occurred_at=datetime(2026, 9, 12, 14, 30),
        )
    )

    assert event.occurred_at.tzinfo == UTC
    assert metric_date_for_event(event).isoformat() == "2026-09-12"


def test_pilot_summary_counts_completed_visitor_experiences() -> None:
    destination_id = uuid4()
    tour_id = uuid4()
    events = [
        normalize_analytics_event(
            AnalyticsEventIn(
                destination_id=destination_id,
                tour_id=tour_id,
                visitor_session_id="session-start",
                event_name=STARTED_VISITOR_EXPERIENCE,
            )
        ),
        normalize_analytics_event(
            AnalyticsEventIn(
                destination_id=destination_id,
                tour_id=tour_id,
                visitor_session_id="session-complete",
                event_name=COMPLETED_VISITOR_EXPERIENCE,
                payload={"completion_method": "gps"},
            )
        ),
        normalize_analytics_event(
            AnalyticsEventIn(
                destination_id=destination_id,
                tour_id=tour_id,
                visitor_session_id="session-manual",
                event_name=COMPLETED_VISITOR_EXPERIENCE,
                payload={"completion_method": "manual"},
            )
        ),
    ]

    summary = summarize_pilot_events(events)

    assert len(summary) == 1
    assert summary[0].destination_id == destination_id
    assert summary[0].tour_id == tour_id
    assert summary[0].started_visitor_experiences == 1
    assert summary[0].completed_visitor_experiences == 2
    assert summary[0].gps_completions == 1
    assert summary[0].manual_completions == 1
    assert summary[0].completion_rate == 2.0
