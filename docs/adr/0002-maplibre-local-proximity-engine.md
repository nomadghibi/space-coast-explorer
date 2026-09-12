# ADR 0002: MapLibre with Local Proximity Engine

## Status

Accepted

## Context

M2 needs a foreground GPS-aware self-guided tour without making location mandatory, adding background geofencing, or depending on an undeployed backend for the public Vercel app.

## Decision

Use MapLibre GL JS in the web app behind a reusable component boundary. Keep framework-independent geographic types and proximity calculations in `packages/maps`. Process browser location locally and persist only tour progress in localStorage.

Map style is configured by `NEXT_PUBLIC_MAP_STYLE_URL`, with a demo MapLibre style fallback for preview deployments. If the map provider, style, or tile loading fails, the tour remains usable through the manual stop list.

## Consequences

The active tour works without user accounts or server persistence in M2. M3 can move tour content into the PostGIS-backed `tours` and `tour_stops` tables without replacing the proximity engine. Production privacy posture is stronger because continuous GPS tracks are not stored by default.
