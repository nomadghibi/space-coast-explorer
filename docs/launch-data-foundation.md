# Launch Data Foundation

Space Coast Explorer uses a server-side Launch Library 2 adapter. The provider documentation currently exposes LL2 API `v2.3.0` at `https://ll.thespacedevs.com`; the frontend never consumes that response shape directly.

## Internal API

- `GET /api/v1/public/launches`
- `GET /api/v1/public/launches/upcoming`
- `GET /api/v1/public/launches/next`
- `GET /api/v1/public/launches/{provider_launch_id}`

Responses contain normalized launch data plus `data_freshness` and `last_updated_at`. The service keeps the last successful in-process result and returns it as stale if the provider fails. Production should move this cache to PostgreSQL or a shared cache before horizontal scaling.

## Configuration

`LAUNCH_DATA_MODE=fixture|development-provider|production` controls the source used by the internal API. `fixture` is the default local-safe mode and returns deterministic Space Coast sample launches without contacting Launch Library 2. `development-provider` and `production` use the provider adapter. Configure `LAUNCH_LIBRARY_BASE_URL`, `LAUNCH_PROVIDER`, `LAUNCH_CACHE_TTL_SECONDS`, and `LAUNCH_SPACE_COAST_PADS` through environment settings.

The web app reads launch data through `NEXT_PUBLIC_API_BASE_URL`. If that value is missing, production-facing web builds show an unavailable state rather than demo launch data. Development fixtures can be explicitly enabled with `NEXT_PUBLIC_ENABLE_LAUNCH_FIXTURES=true`; do not enable this in production unless the UI is clearly being reviewed as a demo.

Default Space Coast filtering accepts pad/location names containing `LC-39A`, `LC-39B`, `SLC-40`, `SLC-41`, `Launch Complex 39A`, `Launch Complex 39B`, `Space Launch Complex 40`, or `Space Launch Complex 41`. This is configurable and should be reviewed as pads change. Missing provider fields remain null; status values outside the explicit mapping become `unknown`.

The current implementation intentionally does not claim real-time status, weather, probability, or livestream availability. It provides normalized launch schedule data and requires a scheduled worker/database cache for production refresh intervals before horizontal scaling.
