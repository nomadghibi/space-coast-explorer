# Architecture

Monorepo with `apps/web`, `apps/api`, `apps/worker`, and shared packages. The API owns authorization, tenant isolation, database writes, migrations, request IDs, and structured logging. Frontend consumes typed contracts. PostGIS and pgvector readiness are established in M0.

M1 uses typed, read-only seed content for public destination and tour discovery. The frontend imports content locally for server-rendered pages while the API exposes matching public endpoints, preserving the future path to database-backed content without blocking the first public experience.
