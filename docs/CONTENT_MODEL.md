# Content Model

Content statuses: draft, fact_check, editorial_review, approved, published, archived. Published factual content must trace to source records.

Media assets are stored separately from editorial prose. Records contain an opaque object-storage key, MIME metadata, processing state, optional duration, and alt text; provider credentials never enter content records.

## Cocoa Village Cluster

Cocoa Village should be modeled as a destination cluster rather than a single map pin.
The pilot content now includes 30 destination POIs across historic landmarks, waterfront,
food, shopping, arts and culture, entertainment, events, family stops, nightlife, and nearby
extensions.

The official Historic Cocoa Village Walking Tour is treated as a featured experience anchor:
11 landmark historic buildings, less than one mile, starting at Porcher House. Restaurants,
shops, events, and nightlife are marked as dynamic POIs because they should eventually come
from directory and calendar ingestion instead of permanent hard-coded seed records.

Priority rules:

- `featured`: core destination anchors worth surfacing in first-run UX.
- `standard`: stable useful places that support the destination model.
- `dynamic`: businesses, tours, events, or nightlife concepts that should be refreshed from
  source systems before public operational use.
