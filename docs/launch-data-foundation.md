# Launch Data Foundation

Space Coast Explorer uses a server-side Launch Library 2 adapter. The provider documentation currently exposes LL2 API `v2.3.0` at `https://ll.thespacedevs.com`; the frontend never consumes that response shape directly.

## Internal API

- `GET /api/v1/public/launches`
- `GET /api/v1/public/launches/upcoming`
- `GET /api/v1/public/launches/next`
- `GET /api/v1/public/launches/{provider_launch_id}`

Responses contain normalized launch data plus `data_freshness` and `last_updated_at`. The service keeps the last successful in-process result and returns it as stale if the provider fails. Production should move this cache to PostgreSQL or a shared cache before horizontal scaling.

## Configuration

`LAUNCH_DATA_MODE=fixture|development-provider|production` is reserved for the rollout modes. The current adapter is provider-backed when called; fixture support should be selected before enabling launch UI in local development. Configure `LAUNCH_LIBRARY_BASE_URL`, `LAUNCH_PROVIDER`, `LAUNCH_CACHE_TTL_SECONDS`, and `LAUNCH_SPACE_COAST_PADS` through environment settings.

Default Space Coast filtering accepts pad/location names containing `LC-39A`, `LC-39B`, `SLC-40`, or `SLC-41`. This is configurable and should be reviewed as pads change. Missing provider fields remain null; status values outside the explicit mapping become `unknown`.

The current implementation intentionally does not claim real-time status, weather, probability, or livestream availability. It provides current provider-backed launch schedule data and requires a scheduled worker/database cache for production refresh intervals.
