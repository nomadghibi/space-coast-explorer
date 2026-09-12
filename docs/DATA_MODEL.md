# Data Model

M0 creates organizations, destinations, analytics_events, jobs, and outbox_events, plus extension readiness for PostGIS and pgvector.

M2 adds PostGIS-compatible tour storage:

- `tours`: destination-owned tour records with slug, title, summary, and optional `geometry(LineString, 4326)` route geometry.
- `tour_stops`: ordered tour stops with stable slug, sequence, title, summary, `geography(Point, 4326)` location, `trigger_radius_meters`, and `exit_radius_meters`.

The public Vercel app still consumes typed seed content in M2 so production does not depend on an undeployed API. M3 CMS should move authored tour content into these tables and publish through read-only public API contracts.
