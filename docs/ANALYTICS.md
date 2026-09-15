# Analytics

Completed Visitor Experiences is the primary metric.

## M9 Pilot Analytics

Pilot analytics are destination-scoped so the platform can begin with Florida's Space Coast
without making Space Coast the permanent tenant boundary.

Core event names:

- `visitor_experience.started`
- `visitor_experience.completed`
- `tour_stop.arrived`
- `tour_stop.completed`
- `pilot_feedback.submitted`

Freemium funnel event names:

- `premium_feature_viewed`
- `premium_gate_opened`
- `premium_gate_dismissed`
- `premium_upgrade_clicked`
- `checkout_started`
- `purchase_completed`
- `purchase_failed`
- `explorer_pass_activated`
- `explorer_pass_expired`
- `full_story_opened`
- `audio_guide_opened`
- `then_and_now_opened`
- `bonus_stop_opened`
- `ai_guide_opened`

The backend stores analytics events with first-class `destination_id`, optional `tour_id`,
`visitor_session_id`, `event_name`, UTC `occurred_at`, and a provider-neutral JSON payload.
The JSON payload may hold details such as completion method, stop slug, feedback rating, or
pilot notes, but dashboard-critical dimensions must graduate to typed columns before they
become operational filters.

## Primary Metric

Completed Visitor Experiences counts `visitor_experience.completed` events. Completion method
is explicit:

- `gps` for proximity-driven completion.
- `manual` for visitor-confirmed completion when GPS is unavailable or inaccurate.

Pilot summaries report starts, completions, GPS completions, manual completions, and completion
rate. Completion rate is `completed / started` and is zero when no starts are present.

## Web Collection

The web app records `visitor_experience.started` and `visitor_experience.completed` events from
the active tour flow. Events are stored locally on the visitor device first. API submission is
enabled only when `NEXT_PUBLIC_ANALYTICS_API_ENABLED=true` and the deployed environment supplies
the required analytics destination and tour UUIDs.

Local events include destination slug, tour slug, visitor session ID, event time, completion
method, and stop counts. They do not include raw latitude, longitude, accuracy, or continuous
movement history.

Freemium events may include feature, plan, source, stop slug, and upgrade trigger. They must not
include precise GPS data or full payment details.

## Privacy Rules

Analytics must not store passwords, authentication tokens, full payment data, or unnecessary
precise location history. GPS-derived events should store only the event outcome and approved
context needed for pilot analysis.
