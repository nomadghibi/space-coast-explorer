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

## Privacy Rules

Analytics must not store passwords, authentication tokens, full payment data, or unnecessary
precise location history. GPS-derived events should store only the event outcome and approved
context needed for pilot analysis.
