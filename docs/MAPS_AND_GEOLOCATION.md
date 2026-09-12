# Maps And Geolocation

M2 uses MapLibre GL JS in the web app through a narrow component boundary. Shared geographic types, route geometry, and proximity calculations live in `packages/maps`; page components do not call MapLibre or browser geolocation directly.

Map style is configurable with `NEXT_PUBLIC_MAP_STYLE_URL`. The product preview defaults to `https://demotiles.maplibre.org/style.json`; production deployments can swap providers without changing tour engine logic.

Foreground location uses `navigator.geolocation.watchPosition()` only after the visitor chooses **Enable Location**. The watcher requests high accuracy with a bounded timeout and maximumAge, clears itself on teardown, and handles denied, unavailable, timeout, and generic error states. Location is never required to complete a tour.

Automatic stop detection is local to the browser. Readings include latitude, longitude, accuracy, and timestamp. M2 does not persist raw GPS history or send movement tracks to analytics.

Map failure must not block the experience. If MapLibre, the configured style, or tiles fail, the active tour presents a useful manual stop list with completion controls.

Development and test builds include a deterministic GPS simulator that feeds synthetic readings into the same proximity engine used by real location data. Simulator controls are not shown in production.
