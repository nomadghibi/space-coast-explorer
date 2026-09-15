export type HealthStatus = { status: "ok"; service: string; requestId: string };

export * from "./itinerary";

export type GeoPoint = {
  latitude: number;
  longitude: number;
};

export type RouteGeometry = {
  type: "LineString";
  coordinates: GeoPoint[];
};

export type MediaAsset = {
  id: string;
  ownerType: "tour" | "tour_stop" | "destination";
  ownerId: string;
  mediaType: "audio" | "image" | "video";
  mimeType: string;
  processingStatus: "pending" | "ready" | "failed";
  durationSeconds?: number;
  altText: string;
};

export type BusinessClaimStatus = "submitted" | "approved" | "rejected" | "withdrawn";

export type DestinationSlug = "space-coast" | "cocoa-village" | "cocoa-beach" | "port-canaveral";

export type TourSlug =
  | "cocoa-village-historic-explorer"
  | "cocoa-beach-surf-space-sand"
  | "port-canaveral-explorer";

export type TourCategory =
  | "History"
  | "Beach"
  | "Space"
  | "Food"
  | "Family"
  | "Cruise"
  | "Arts & Culture"
  | "Nature";

export type TransportMode = "Walking" | "Driving" | "Mixed";

export type PremiumFeature =
  | "full_stories"
  | "audio_guides"
  | "then_and_now"
  | "bonus_stops"
  | "multiple_saved_tours"
  | "smart_nearby"
  | "ai_local_guide"
  | "offline_access"
  | "custom_itineraries"
  | "cruise_planner";

export type EntitlementPlan = "free" | "explorer_pass";

export type ExplorerPassStatus = "inactive" | "active" | "expired" | "refunded" | "cancelled";

export type UserEntitlements = {
  plan: EntitlementPlan;
  entitlements: PremiumFeature[];
  startsAt?: string;
  expiresAt?: string;
  status: ExplorerPassStatus;
};

export type TourSummary = {
  slug: TourSlug;
  title: string;
  destinationSlug: Exclude<DestinationSlug, "space-coast">;
  destinationName: string;
  summary: string;
  description: string;
  categories: TourCategory[];
  transportMode: TransportMode;
  durationMinutes: number;
  distanceMiles: number;
  stopCount: number;
  priceLabel: "Free" | "Premium";
  premiumUpsell?: {
    freeIncludes: string[];
    premiumUnlocks: PremiumFeature[];
  };
  difficulty: "Easy" | "Moderate";
  startLocation: string;
  accessibilitySummary: string;
  imageUrl: string;
  imageAlt: string;
};

export type TourStop = {
  sequence: number;
  slug: string;
  title: string;
  summary: string;
  visitorStory?: string;
  fullStory?: string;
  premiumStoryTeaser?: string;
  premiumContentAvailable?: boolean;
  audioUrl?: string;
  thenAndNow?: {
    historicImageUrl: string;
    currentImageUrl: string;
    caption: string;
    dateKnown?: string;
    sourceAttribution: string;
    licenseInfo: string;
  };
  imageAlt?: string;
  internalEditorialState?: "needs_fact_check" | "ready";
  coordinateVerificationStatus?: "map_verified_provisional" | "needs_field_verification" | "field_verified";
  location?: GeoPoint;
  triggerRadiusMeters?: number;
  exitRadiusMeters?: number;
};

export type TourDetail = TourSummary & {
  highlights: string[];
  safetyNotes: string[];
  startPoint?: {
    title: string;
    address: string;
    landmark: string;
    arrivalTips: string[];
    parkingNotes: string[];
    accessibilityNotes: string[];
  };
  stops: TourStop[];
  staticRouteSummary: string;
  routeGeometry?: RouteGeometry;
};

export type Destination = {
  slug: DestinationSlug;
  name: string;
  eyebrow: string;
  summary: string;
  introduction: string[];
  highlights: string[];
  quickInfo: {
    bestFor: string;
    typicalVisitLength: string;
    walkingFriendliness: string;
    familySuitability: string;
    parkingSummary: string;
  };
  imageUrl: string;
  imageAlt: string;
};

export type DestinationPoiCategory =
  | "Historic Landmark"
  | "Walking Tour / Historic District"
  | "Waterfront"
  | "Food"
  | "Shopping"
  | "Arts & Culture"
  | "Entertainment"
  | "Events"
  | "Family"
  | "Nightlife"
  | "Nearby Extension";

export type DestinationPoi = {
  slug: string;
  destinationSlug: Exclude<DestinationSlug, "space-coast">;
  name: string;
  category: DestinationPoiCategory;
  summary: string;
  description?: string[];
  imageUrl?: string;
  imageAlt?: string;
  secondaryImageUrl?: string;
  secondaryImageAlt?: string;
  priority: "featured" | "standard" | "dynamic";
  address?: string;
  sourceUrl?: string;
};
