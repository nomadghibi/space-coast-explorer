# Milestones

## M0 Foundation

Goal: production monorepo foundation. Scope: docs, web/api/worker shells, shared packages, health endpoints, logging, request IDs, config, Docker Compose, CI, Alembic, migration, tests. Non-scope: tours, maps, GPS, AI, merchants, billing, destination UI. Acceptance: all gates pass, empty DB migration works, one Alembic head, no secrets, README commands.

## M1 Public Destination Experience - COMPLETE

Goal: public destination and tour discovery UX.

Scope: homepage, `/space-coast`, Cocoa Village/Cocoa Beach/Port Canaveral destination pages, `/tours`, `/tours/[slug]`, `/about`, `/privacy`, static route preview UI, SEO metadata, typed seed content, and read-only public API endpoints.

Non-scope: GPS, AI/RAG, billing, merchant portal, cruise itinerary generation, background geolocation, real-time routing, purchases, and user accounts.

Acceptance: visitors can understand Space Coast Explorer, browse the first destination areas, browse and filter tours through URL query parameters, view tour detail with duration/distance/stops/accessibility/start location/static route preview, and browse on mobile without installation.

Tests: public page rendering, tour filtering, API content endpoints.

Exit criteria: public experience is polished, responsive, crawlable, documented, and ready for M2 tour engine work.

## M2 Map + GPS + Tour Engine
Goal: active tour engine with map and foreground geolocation.

Scope: MapLibre map rendering, configurable map style URL, curated static route geometry, numbered stop markers, foreground-only browser geolocation, local proximity detection, trigger/exit hysteresis, poor-accuracy handling, active tour session persistence, resume prompt, manual completion fallback, and development GPS simulator.

Non-scope: background geofencing, native apps, AI/RAG, audio narration, merchant portal, billing, cruise itinerary engine, live launch integration, push notifications, social features, and turn-by-turn routing.

Acceptance: Cocoa Village Historic Explorer renders on a real map, can show visitor position when permission is granted, detects arrivals locally, persists progress across reload, can be completed manually without GPS, degrades when map/style loading fails, and has unit plus browser journey coverage.

## M3 Admin CMS
Goal: internal content administration.

## M4 Audio and Media
Goal: narrated and media-rich experiences.

## M5 AI Guide / RAG
Goal: grounded destination guide.

## M6 Itinerary + Cruise Companion
Goal: deterministic itinerary generation and cruise-aware timing.

## M7 Merchant Platform
Goal: merchant accounts and claimed businesses.

## M8 Billing
Goal: premium tours and merchant billing.

## M9 Pilot Analytics
Goal: pilot measurement and operational dashboards.
