# Cocoa Village Coordinate Audit

Reference label: **map-verified / provisional, not field-verified**.

This audit compares the current repository data for `cocoa-village-historic-explorer` against the provisional 11-stop reference table supplied on September 14, 2026. It does not overwrite route data automatically.

## Summary

- Current repo tour stop count: **10**
- Provisional reference stop count: **11**
- Current repo order starts at **Porcher House**; the reference order starts at **Parrish Grove Inn / Pette House**.
- Current repo coordinates differ from the high-confidence reference points by roughly **618m to 1,259m**.
- `Sur Le Parc`, `Hindle Building`, and `Blair Building` remain **needs_field_verification** because the reference table has no usable latitude/longitude.
- The walking simulator should not treat the current route as field-ready until the route model is reconciled.

## Audit Table

| Ref # | Reference stop | Repo match | Repo # | Reference coords | Repo coords | Delta | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Parrish Grove Inn / Pette House | Parrish Grove Inn | 2 | 28.351836, -80.724905 | 28.36314, -80.72555 | 1259m | SUSPICIOUS_DISTANCE |
| 2 | Porcher House | Porcher House | 1 | 28.353867, -80.725233 | 28.3625, -80.72556 | 960m | SUSPICIOUS_DISTANCE |
| 3 | Sur Le Parc | none | n/a | MISSING_COORDINATES | MISSING_REPO_STOP | n/a | MISSING_REPO_STOP |
| 4 | St. Mark's Episcopal Church | none | n/a | 28.353367, -80.724667 | MISSING_REPO_STOP | n/a | MISSING_REPO_STOP |
| 5 | Hindle Building | none | n/a | MISSING_COORDINATES | MISSING_REPO_STOP | n/a | MISSING_REPO_STOP |
| 6 | Derby Street Chapel | none | n/a | 28.3509, -80.726083 | MISSING_REPO_STOP | n/a | MISSING_REPO_STOP |
| 7 | S.F. Travis & Company | S.F. Travis Company | 3 | 28.355783, -80.7253 | 28.36282, -80.7244 | 787m | SUSPICIOUS_DISTANCE |
| 8 | Masonic Temple / Village Tower | Village Tower | 5 | 28.354928, -80.726233 | 28.36143, -80.72472 | 738m | SUSPICIOUS_DISTANCE |
| 9 | Blair Building | none | n/a | MISSING_COORDINATES | MISSING_REPO_STOP | n/a | MISSING_REPO_STOP |
| 10 | Brevard County State Bank | Historic Bank Corner | 4 | 28.354893, -80.725525 | 28.36214, -80.72414 | 817m | SUSPICIOUS_DISTANCE |
| 11 | Cocoa Village Playhouse | Playhouse and Street Art | 6 | 28.355283, -80.726133 | 28.36072, -80.72483 | 618m | SUSPICIOUS_DISTANCE |

## Current Repo Stops

| Repo # | Stop | Latitude | Longitude | Trigger radius | Exit radius |
| --- | --- | --- | --- | --- | --- |
| 1 | Porcher House | 28.3625 | -80.72556 | 35m | 60m |
| 2 | Parrish Grove Inn | 28.36314 | -80.72555 | 35m | 60m |
| 3 | S.F. Travis Company | 28.36282 | -80.7244 | 35m | 60m |
| 4 | Historic Bank Corner | 28.36214 | -80.72414 | 35m | 60m |
| 5 | Village Tower | 28.36143 | -80.72472 | 35m | 60m |
| 6 | Playhouse and Street Art | 28.36072 | -80.72483 | 35m | 60m |
| 7 | Myrt Tharpe Square | 28.36013 | -80.72543 | 35m | 60m |
| 8 | Brevard Avenue Storefronts | 28.36003 | -80.72631 | 35m | 60m |
| 9 | Riverfront Park and Boardwalk | 28.3606 | -80.72725 | 35m | 60m |
| 10 | Indian River Finish | 28.36145 | -80.7272 | 35m | 60m |

## Duplicate Point Check

No current repo stop coordinates are within 10m of each other.

## Recommendation

Do not run a full 11-stop walking simulation as if it were field-ready yet. First reconcile the route content model:

1. Decide whether the pilot route should be the supplied 11-stop historical landmark route or the current 10-stop mixed landmark/waterfront route.
2. Add explicit coordinate verification metadata to tour stops, such as `map_verified`, `needs_field_verification`, and `field_verified`.
3. Keep `Sur Le Parc`, `Hindle Building`, and `Blair Building` excluded from automatic arrival testing until coordinates are confirmed.
4. After reconciliation, run simulated walking only against stops with usable coordinates.
