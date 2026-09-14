# Cocoa Village Coordinate Audit

Reference label: **map-verified / provisional, not field-verified**.

This audit compares the current repository data for `cocoa-village-historic-explorer` against the provisional 11-stop reference table supplied on September 14, 2026. It does not treat the route as field-verified.

## Summary

- Current repo tour stop count: **11**
- Provisional reference stop count: **11**
- Current repo order now matches the supplied 11-stop historical landmark sequence.
- Eight stops have usable provisional map coordinates.
- `Sur Le Parc`, `Hindle Building`, and `Blair Building` remain **needs_field_verification** and are excluded from automatic arrival testing until coordinates are confirmed.
- No current repo stop coordinates are within 10m of each other.

## Audit Table

| Ref # | Reference stop | Repo match | Repo # | Reference coords | Repo coords | Delta | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Parrish Grove Inn / Pette House | Parrish Grove Inn / Pette House | 1 | 28.351836, -80.724905 | 28.351836, -80.724905 | 0m | WITHIN_EXPECTED_RANGE |
| 2 | Porcher House | Porcher House | 2 | 28.353867, -80.725233 | 28.353867, -80.725233 | 0m | WITHIN_EXPECTED_RANGE |
| 3 | Sur Le Parc | Sur Le Parc | 3 | MISSING_COORDINATES | MISSING_COORDINATES | n/a | NEEDS_FIELD_VERIFICATION |
| 4 | St. Mark's Episcopal Church | St. Mark's Episcopal Church | 4 | 28.353367, -80.724667 | 28.353367, -80.724667 | 0m | WITHIN_EXPECTED_RANGE |
| 5 | Hindle Building | Hindle Building | 5 | MISSING_COORDINATES | MISSING_COORDINATES | n/a | NEEDS_FIELD_VERIFICATION |
| 6 | Derby Street Chapel | Derby Street Chapel | 6 | 28.3509, -80.726083 | 28.3509, -80.726083 | 0m | WITHIN_EXPECTED_RANGE |
| 7 | S.F. Travis & Company | S.F. Travis & Company | 7 | 28.355783, -80.7253 | 28.355783, -80.7253 | 0m | WITHIN_EXPECTED_RANGE |
| 8 | Masonic Temple / Village Tower | Masonic Temple / Village Tower | 8 | 28.354928, -80.726233 | 28.354928, -80.726233 | 0m | WITHIN_EXPECTED_RANGE |
| 9 | Blair Building | Blair Building | 9 | MISSING_COORDINATES | MISSING_COORDINATES | n/a | NEEDS_FIELD_VERIFICATION |
| 10 | Brevard County State Bank | Brevard County State Bank | 10 | 28.354893, -80.725525 | 28.354893, -80.725525 | 0m | WITHIN_EXPECTED_RANGE |
| 11 | Cocoa Village Playhouse | Cocoa Village Playhouse | 11 | 28.355283, -80.726133 | 28.355283, -80.726133 | 0m | WITHIN_EXPECTED_RANGE |

## Current Repo Stops

| Repo # | Stop | Latitude | Longitude | Trigger radius | Exit radius | Verification |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Parrish Grove Inn / Pette House | 28.351836 | -80.724905 | 35m | 60m | map_verified_provisional |
| 2 | Porcher House | 28.353867 | -80.725233 | 35m | 60m | map_verified_provisional |
| 3 | Sur Le Parc | MISSING_COORDINATES | MISSING_COORDINATES | n/a | n/a | needs_field_verification |
| 4 | St. Mark's Episcopal Church | 28.353367 | -80.724667 | 35m | 60m | map_verified_provisional |
| 5 | Hindle Building | MISSING_COORDINATES | MISSING_COORDINATES | n/a | n/a | needs_field_verification |
| 6 | Derby Street Chapel | 28.3509 | -80.726083 | 35m | 60m | map_verified_provisional |
| 7 | S.F. Travis & Company | 28.355783 | -80.7253 | 35m | 60m | map_verified_provisional |
| 8 | Masonic Temple / Village Tower | 28.354928 | -80.726233 | 35m | 60m | map_verified_provisional |
| 9 | Blair Building | MISSING_COORDINATES | MISSING_COORDINATES | n/a | n/a | needs_field_verification |
| 10 | Brevard County State Bank | 28.354893 | -80.725525 | 35m | 60m | map_verified_provisional |
| 11 | Cocoa Village Playhouse | 28.355283 | -80.726133 | 35m | 60m | map_verified_provisional |

## Duplicate Point Check

No current repo stop coordinates are within 10m of each other.

## Recommendation

The simulator can now run against the eight stops with usable provisional map coordinates. Before public field confidence, verify:

1. Missing coordinates for `Sur Le Parc`, `Hindle Building`, and `Blair Building`.
2. Safe pedestrian order between all 11 stops.
3. Sidewalks, crossings, accessibility, parking assumptions, and GPS behavior on a real phone.
4. Whether any provisional coordinate should move from `map_verified_provisional` to `field_verified`.
