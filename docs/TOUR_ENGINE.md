# Tour Engine

M2 introduces an active tour engine for Cocoa Village Historic Explorer while preserving manual navigation as a permanent fallback.

The client session model stores `tourSlug`, `startedAt`, `currentStopSlug`, `completedStopSlugs`, `locationEnabled`, `tourCompleted`, and `arrivedStopSlugs` in localStorage behind `apps/web/src/lib/tour-session.ts`. Progress derives only from completed stops, not the currently viewed page.

The proximity algorithm lives in `packages/maps` and uses Haversine distance. A stop can trigger arrival when a useful-accuracy reading enters `triggerRadiusMeters`; once arrived, hysteresis keeps the stop arrived until the visitor exceeds `exitRadiusMeters`. This prevents repeated arrival toggles from GPS jitter. Poor accuracy readings above `maximumUsefulAccuracyMeters` do not trigger arrival.

Stop states are `not_started`, `approaching`, `arrived`, and `completed`. Visitor-facing messaging is intentionally low frequency: distance, getting close, arrived, or completed.

M2 does not implement turn-by-turn routing. Route geometry is curated and static. The app must never suggest crossing restricted areas, private property, unsafe roads, or cruise terminal restricted zones.

M6 itinerary planning is deterministic and advisory. Cruise return buffers are subtracted before selecting activities; the planner does not claim live ship, traffic, or venue availability.
