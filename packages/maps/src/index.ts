export type GeoPoint = { latitude: number; longitude: number };

export type RouteGeometry = {
  type: "LineString";
  coordinates: GeoPoint[];
};

export type LocationReading = GeoPoint & {
  accuracy: number;
  timestamp: number;
};

export type ProximityStop = {
  slug: string;
  sequence: number;
  location: GeoPoint;
  triggerRadiusMeters: number;
  exitRadiusMeters: number;
};

export type StopProximityState = "not_started" | "approaching" | "arrived" | "completed";

export type ProximityResult = {
  stopSlug: string;
  state: StopProximityState;
  distanceMeters: number;
  arrivalTriggered: boolean;
  accuracyUsable: boolean;
};

export type TourSessionState = {
  tourSlug: string;
  startedAt: string;
  currentStopSlug: string;
  completedStopSlugs: string[];
  locationEnabled: boolean;
  tourCompleted: boolean;
  arrivedStopSlugs: string[];
};

export type ProximityOptions = {
  maximumUsefulAccuracyMeters: number;
  approachingDistanceMeters: number;
};

export const defaultProximityOptions: ProximityOptions = {
  maximumUsefulAccuracyMeters: 50,
  approachingDistanceMeters: 120
};

const earthRadiusMeters = 6_371_000;

function degreesToRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

export function distanceMeters(from: GeoPoint, to: GeoPoint) {
  const fromLat = degreesToRadians(from.latitude);
  const toLat = degreesToRadians(to.latitude);
  const deltaLat = degreesToRadians(to.latitude - from.latitude);
  const deltaLon = degreesToRadians(to.longitude - from.longitude);
  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(fromLat) * Math.cos(toLat) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

  return 2 * earthRadiusMeters * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function createTourSession(tourSlug: string, firstStopSlug: string, now = new Date()): TourSessionState {
  return {
    tourSlug,
    startedAt: now.toISOString(),
    currentStopSlug: firstStopSlug,
    completedStopSlugs: [],
    locationEnabled: false,
    tourCompleted: false,
    arrivedStopSlugs: []
  };
}

export function evaluateStopProximity(
  stop: ProximityStop,
  reading: LocationReading,
  previousState: StopProximityState = "not_started",
  options = defaultProximityOptions
): ProximityResult {
  const distance = distanceMeters(reading, stop.location);
  const accuracyUsable = reading.accuracy <= options.maximumUsefulAccuracyMeters;

  if (previousState === "completed") {
    return { stopSlug: stop.slug, state: "completed", distanceMeters: distance, arrivalTriggered: false, accuracyUsable };
  }

  if (!accuracyUsable) {
    return { stopSlug: stop.slug, state: previousState, distanceMeters: distance, arrivalTriggered: false, accuracyUsable };
  }

  if (previousState === "arrived" && distance <= stop.exitRadiusMeters) {
    return { stopSlug: stop.slug, state: "arrived", distanceMeters: distance, arrivalTriggered: false, accuracyUsable };
  }

  if (distance <= stop.triggerRadiusMeters) {
    return {
      stopSlug: stop.slug,
      state: "arrived",
      distanceMeters: distance,
      arrivalTriggered: previousState !== "arrived",
      accuracyUsable
    };
  }

  if (distance <= options.approachingDistanceMeters) {
    return { stopSlug: stop.slug, state: "approaching", distanceMeters: distance, arrivalTriggered: false, accuracyUsable };
  }

  return { stopSlug: stop.slug, state: "not_started", distanceMeters: distance, arrivalTriggered: false, accuracyUsable };
}

export function markStopCompleted(
  session: TourSessionState,
  orderedStopSlugs: string[],
  stopSlug: string
): TourSessionState {
  const completedStopSlugs = session.completedStopSlugs.includes(stopSlug)
    ? session.completedStopSlugs
    : [...session.completedStopSlugs, stopSlug];
  const stopIndex = orderedStopSlugs.indexOf(stopSlug);
  const nextStopSlug = orderedStopSlugs.find((slug, index) => index > stopIndex && !completedStopSlugs.includes(slug));

  return {
    ...session,
    completedStopSlugs,
    currentStopSlug: nextStopSlug ?? stopSlug,
    tourCompleted: completedStopSlugs.length >= orderedStopSlugs.length
  };
}

export function recordArrival(session: TourSessionState, stopSlug: string): TourSessionState {
  if (session.arrivedStopSlugs.includes(stopSlug)) {
    return session;
  }

  return {
    ...session,
    arrivedStopSlugs: [...session.arrivedStopSlugs, stopSlug],
    currentStopSlug: stopSlug
  };
}

export function progressPercent(completedCount: number, totalCount: number) {
  if (totalCount <= 0) {
    return 0;
  }

  return Math.round((completedCount / totalCount) * 100);
}

export function formatDistance(distanceMetersValue: number) {
  if (distanceMetersValue < 161) {
    return `${Math.round(distanceMetersValue)} m`;
  }

  return `${(distanceMetersValue / 1609.344).toFixed(1)} miles`;
}
