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
  imageAlt?: string;
  internalEditorialState?: "needs_fact_check" | "ready";
  location?: GeoPoint;
  triggerRadiusMeters?: number;
  exitRadiusMeters?: number;
};

export type TourDetail = TourSummary & {
  highlights: string[];
  safetyNotes: string[];
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
