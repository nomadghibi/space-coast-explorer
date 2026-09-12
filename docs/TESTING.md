# Testing

M0 gates: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `ruff check .`, `mypy .`, `pytest`, migration upgrade, one Alembic head, no committed secrets.

M2 adds unit coverage for the framework-independent proximity engine: Haversine distance, arrival, no arrival, hysteresis, GPS jitter, poor accuracy, duplicate arrival suppression, and tour completion.

M2 browser coverage uses Playwright mobile Chromium for active tour journeys:

- mocked geolocation permission and arrival detection
- denied-location/manual completion path

Playwright specs live under `apps/web/e2e` and run with `pnpm --filter @space-coast-explorer/web test:e2e`. Vitest excludes `e2e`.
