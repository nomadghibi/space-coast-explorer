# Architecture

Monorepo with `apps/web`, `apps/api`, `apps/worker`, and shared packages. The API owns authorization, tenant isolation, database writes, migrations, request IDs, and structured logging. Frontend consumes typed contracts. PostGIS and pgvector readiness are established in M0.

M1 uses typed, read-only seed content for public destination and tour discovery. The frontend imports content locally for server-rendered pages while the API exposes matching public endpoints, preserving the future path to database-backed content without blocking the first public experience.

M2 adds a reusable mapping and proximity boundary in `packages/maps`. The web app owns browser-only concerns through client hooks and services: foreground geolocation, localStorage-backed active tour sessions, MapLibre lifecycle, and development-only simulated location readings. The proximity engine is framework-independent and calculates Haversine distance, accuracy gating, arrival hysteresis, duplicate-arrival suppression, and completion progress without persisting raw GPS tracks.

Map provider configuration is driven by `NEXT_PUBLIC_MAP_STYLE_URL` with a public MapLibre demo style fallback for local/product preview. If a style or map library fails, active tours fall back to the ordered stop list and manual completion controls.

The API remains deployable independently of Vercel. M2 prepares PostGIS-backed `tours` and `tour_stops` tables with route `LINESTRING`, stop `geography(Point, 4326)`, trigger radius, and exit radius columns so M3 CMS can move tour content from typed seed data into the database.
