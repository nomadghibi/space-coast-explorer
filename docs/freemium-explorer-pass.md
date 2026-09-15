# Freemium Explorer Pass

Space Coast Explorer is currently the Cocoa Village Pilot / Pre-Field-Validation product. The free tier must remain useful: visitors can complete the full official Cocoa Village Historic Explorer without payment.

## Free

Price: `$0`.

Free includes destination pages, tour discovery, all 11 official Cocoa Village stops, verified map pins where available, the start location, route display, stop ordering, short stop summaries, basic photos, directions, manual progress, completed stop count, distance traveled, elapsed time, one active saved tour, and basic tour filters.

Free visitors must never see “pay to continue to the next stop.”

## Explorer Pass

Initial pilot price: `$5.99 / 24 hours`.

Explorer Pass is modeled as a time-limited entitlement bundle. Current entitlement IDs are `full_stories`, `audio_guides`, `then_and_now`, `bonus_stops`, `multiple_saved_tours`, `smart_nearby`, `ai_local_guide`, `offline_access`, `custom_itineraries`, and `cruise_planner`.

Current usable premium feature: full stop story text where editorial content already exists.

Gated placeholders: audio guide, Then & Now, bonus discoveries, AI Local Guide, offline access, custom itineraries, and cruise planning. These must be shown as Coming Soon, Planned Premium Feature, or unavailable in pilot until real implementation, source metadata, and licensing exist.

## Paywall UX

Premium appears contextually on stop pages, premium preview cards, and after meaningful engagement. The default engagement trigger is three completed stops. The prompt is dismissible, stores dismissal locally, and must not block progress.

Continue Free must always remain available. Official Cocoa Village stops and route navigation remain free.

## Entitlement Authority

The frontend entitlement module is a pilot display/cache boundary. Production paid access must be calculated server-side by the API before real checkout is enabled. Local storage may store anonymous progress, dismissal state, and cached entitlement display, but it is not authoritative for production purchases.

Explorer Pass records should preserve plan code, provider, provider reference, status, starts at, expires at, created at, and updated at. Current statuses are inactive, active, expired, refunded, and cancelled.

## Development Mode

Development Explorer Pass controls are allowed only when `NEXT_PUBLIC_ENABLE_DEV_EXPLORER_PASS=true` and `NODE_ENV !== "production"`. These controls must not be exposed to production visitors.

## Analytics

Freemium analytics events include `premium_feature_viewed`, `premium_gate_opened`, `premium_gate_dismissed`, `premium_upgrade_clicked`, `checkout_started`, `purchase_completed`, `purchase_failed`, `explorer_pass_activated`, `explorer_pass_expired`, `full_story_opened`, `audio_guide_opened`, `then_and_now_opened`, `bonus_stop_opened`, and `ai_guide_opened`.

Payloads may include destination slug, tour slug, stop slug, feature, plan, source, and upgrade trigger. Do not collect precise location for premium analytics.

## Production Payment Gaps

Real payment is not live. Before enabling paid Explorer Pass checkout, connect a production payment provider such as Stripe, create the Explorer Pass product, implement server-side entitlement activation and webhook verification, add restoration across devices where account linkage exists, and complete refund/cancellation handling.

## Rollout

Stage 1: internal development/testing.

Stage 2: pilot visitors see premium previews while checkout remains disabled.

Stage 3: enable real Explorer Pass checkout.

Stage 4: measure conversion and engagement.

Stage 5: decide whether to build audio, Then & Now, AI guide, family pass, or annual plan based on behavior.
