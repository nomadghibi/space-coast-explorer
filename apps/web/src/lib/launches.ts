export type LaunchStatus =
  | "scheduled"
  | "go"
  | "hold"
  | "delayed"
  | "scrubbed"
  | "launched"
  | "success"
  | "failure"
  | "unknown";

export type Launch = {
  id: string;
  provider_source: string;
  provider_launch_id: string;
  name: string;
  slug: string;
  launch_provider: {
    name: string | null;
    abbreviation: string | null;
  };
  rocket: {
    name: string | null;
    full_name: string | null;
    image_url: string | null;
  } | null;
  mission: {
    name: string | null;
    description: string | null;
    type: string | null;
    orbit: string | null;
  } | null;
  pad: {
    name: string | null;
    location_name: string | null;
    latitude: number | string | null;
    longitude: number | string | null;
  } | null;
  status: LaunchStatus;
  net: string | null;
  window_start: string | null;
  window_end: string | null;
  image_url: string | null;
  webcast_url: string | null;
  last_updated_at: string | null;
};

export type ViewingSpotQuality = "excellent" | "good" | "limited";

export type ViewingSpot = {
  id: string;
  name: string;
  imageUrl?: string;
  imageAlt?: string;
  distanceFromPadMiles?: number;
  distanceFromVisitorMiles?: number;
  quality: ViewingSpotQuality;
  lineOfSightNotes?: string;
  parking?: string;
  accessibility?: string;
  hours?: string;
  expectedCrowdLevel?: "low" | "moderate" | "high";
  directionsUrl: string;
  latitude: number;
  longitude: number;
  developmentFixture?: boolean;
};

export type LaunchesResponse = {
  data: Launch[];
  data_freshness: "fresh" | "stale";
  last_updated_at: string | null;
};

export type LaunchFeedState =
  | {
      status: "ready";
      launches: Launch[];
      dataFreshness: "fresh" | "stale";
      lastUpdatedAt: string | null;
    }
  | {
      status: "unavailable";
      launches: [];
      dataFreshness: "unavailable";
      lastUpdatedAt: null;
      reason: "api_not_configured" | "api_error";
    };

export const developmentViewingSpots: ViewingSpot[] = [
  {
    id: "space-view-park-dev",
    name: "Space View Park",
    imageUrl: "/images/cocoa-village/landmarks/cocoa-riverfront-park.jpg",
    imageAlt: "Riverfront promenade along the Indian River",
    distanceFromPadMiles: 13.4,
    distanceFromVisitorMiles: 0.8,
    quality: "excellent",
    lineOfSightNotes: "Open riverfront view toward launch azimuths when conditions are clear.",
    parking: "Limited public parking nearby; confirm local restrictions before launch day.",
    accessibility: "Paved waterfront paths with nearby seating areas.",
    hours: "Public park hours vary by event and city guidance.",
    expectedCrowdLevel: "high",
    directionsUrl: "https://www.google.com/maps/search/?api=1&query=Space+View+Park+Titusville+FL",
    latitude: 28.614,
    longitude: -80.807,
    developmentFixture: true
  },
  {
    id: "cocoa-riverfront-dev",
    name: "Cocoa Riverfront Park",
    imageUrl: "/images/cocoa-village/landmarks/cocoa-riverfront-park.jpg",
    imageAlt: "Cocoa Riverfront Park promenade and water view",
    distanceFromPadMiles: 20.1,
    quality: "good",
    lineOfSightNotes: "Longer-range viewing with riverfront atmosphere; visibility depends on trajectory.",
    parking: "Use posted public parking rules in Cocoa Village.",
    accessibility: "Paved promenade and nearby public amenities.",
    directionsUrl: "https://www.google.com/maps/search/?api=1&query=Cocoa+Riverfront+Park+Cocoa+FL",
    latitude: 28.354,
    longitude: -80.722,
    developmentFixture: true
  },
  {
    id: "jetty-park-dev",
    name: "Jetty Park",
    distanceFromPadMiles: 11.6,
    quality: "good",
    lineOfSightNotes: "Coastal viewing area; confirm access, fees, and launch-day closures.",
    parking: "Parking may require reservation or fee.",
    accessibility: "Verify accessible parking and beach access before travel.",
    expectedCrowdLevel: "moderate",
    directionsUrl: "https://www.google.com/maps/search/?api=1&query=Jetty+Park+Cape+Canaveral+FL",
    latitude: 28.406,
    longitude: -80.593,
    developmentFixture: true
  },
  {
    id: "minimal-spot-dev",
    name: "Viewing Spot Under Review",
    quality: "limited",
    directionsUrl: "https://www.google.com/maps/search/?api=1&query=Cape+Canaveral+FL",
    latitude: 28.51,
    longitude: -80.62,
    developmentFixture: true
  }
];

export const developmentLaunches: Launch[] = [
  {
    id: "development:go",
    provider_source: "development_fixture",
    provider_launch_id: "development-go",
    name: "Falcon 9 | Development GO Mission",
    slug: "development-go-mission",
    launch_provider: { name: "SpaceX", abbreviation: "SpX" },
    rocket: { name: "Falcon 9", full_name: "Falcon 9 Block 5", image_url: null },
    mission: {
      name: "Development GO Mission",
      description: "Development fixture for Launch Mode countdown and viewing UX.",
      type: "Development fixture",
      orbit: "Low Earth Orbit"
    },
    pad: { name: "LC-39A", location_name: "Kennedy Space Center, FL", latitude: 28.608, longitude: -80.604 },
    status: "go",
    net: new Date(Date.now() + 2 * 60 * 60 * 1000 + 14 * 60 * 1000).toISOString(),
    window_start: null,
    window_end: null,
    image_url: null,
    webcast_url: null,
    last_updated_at: new Date().toISOString()
  },
  {
    id: "development:delayed",
    provider_source: "development_fixture",
    provider_launch_id: "development-delayed",
    name: "Atlas V | Development Delayed Mission",
    slug: "development-delayed-mission",
    launch_provider: { name: "United Launch Alliance", abbreviation: "ULA" },
    rocket: { name: "Atlas V", full_name: "Atlas V", image_url: null },
    mission: null,
    pad: { name: "SLC-41", location_name: "Cape Canaveral SFS, FL", latitude: 28.583, longitude: -80.583 },
    status: "delayed",
    net: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
    window_start: null,
    window_end: null,
    image_url: null,
    webcast_url: null,
    last_updated_at: new Date().toISOString()
  },
  {
    id: "development:scrubbed",
    provider_source: "development_fixture",
    provider_launch_id: "development-scrubbed",
    name: "New Glenn | Development Scrubbed Mission",
    slug: "development-scrubbed-mission",
    launch_provider: { name: "Blue Origin", abbreviation: "BO" },
    rocket: { name: "New Glenn", full_name: "New Glenn", image_url: null },
    mission: null,
    pad: { name: "LC-36", location_name: "Cape Canaveral SFS, FL", latitude: 28.47, longitude: -80.54 },
    status: "scrubbed",
    net: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(),
    window_start: null,
    window_end: null,
    image_url: null,
    webcast_url: null,
    last_updated_at: new Date().toISOString()
  },
  {
    id: "development:unknown-time",
    provider_source: "development_fixture",
    provider_launch_id: "development-unknown-time",
    name: "Mission With Pending Launch Time",
    slug: "development-unknown-time",
    launch_provider: { name: null, abbreviation: null },
    rocket: null,
    mission: null,
    pad: { name: "SLC-40", location_name: "Cape Canaveral SFS, FL", latitude: 28.562, longitude: -80.577 },
    status: "unknown",
    net: null,
    window_start: null,
    window_end: null,
    image_url: null,
    webcast_url: null,
    last_updated_at: new Date().toISOString()
  }
];

const statusLabels: Record<LaunchStatus, string> = {
  scheduled: "Scheduled",
  go: "Go",
  hold: "Hold",
  delayed: "Delayed",
  scrubbed: "Scrubbed",
  launched: "Launched",
  success: "Success",
  failure: "Failure",
  unknown: "Status pending"
};

const statusClasses: Record<LaunchStatus, string> = {
  scheduled: "border-sky-300/70 bg-sky-400/15 text-sky-100",
  go: "border-emerald-300/70 bg-emerald-400/15 text-emerald-100",
  hold: "border-amber-300/70 bg-amber-400/15 text-amber-100",
  delayed: "border-amber-300/70 bg-amber-400/15 text-amber-100",
  scrubbed: "border-red-300/70 bg-red-400/15 text-red-100",
  launched: "border-cyan-300/70 bg-cyan-400/15 text-cyan-100",
  success: "border-emerald-300/70 bg-emerald-400/15 text-emerald-100",
  failure: "border-red-300/70 bg-red-400/15 text-red-100",
  unknown: "border-slate-500 bg-slate-800 text-slate-100"
};

export function launchStatusLabel(status: LaunchStatus) {
  return statusLabels[status] ?? statusLabels.unknown;
}

export function launchStatusClass(status: LaunchStatus) {
  return statusClasses[status] ?? statusClasses.unknown;
}

export function formatLaunchDate(value: string | null) {
  if (!value) {
    return "Time pending";
  }

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York",
    timeZoneName: "short"
  }).format(new Date(value));
}

export function formatLaunchWindow(launch: Pick<Launch, "window_start" | "window_end">) {
  if (!launch.window_start || !launch.window_end) {
    return "Launch window pending";
  }

  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York",
    timeZoneName: "short"
  });

  return `${formatter.format(new Date(launch.window_start))} - ${formatter.format(new Date(launch.window_end))}`;
}

export type CountdownState = {
  label: string;
  expired: boolean;
  accessibleLabel: string;
};

export function countdownState(launchAt: string | null, nowMs = Date.now()): CountdownState {
  if (!launchAt) {
    return {
      label: "T pending",
      expired: false,
      accessibleLabel: "Launch time pending"
    };
  }

  const targetMs = Date.parse(launchAt);
  if (!Number.isFinite(targetMs)) {
    return {
      label: "T pending",
      expired: false,
      accessibleLabel: "Launch time pending"
    };
  }

  const totalSeconds = Math.max(0, Math.floor((targetMs - nowMs) / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const label = `T-${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  if (totalSeconds === 0) {
    return {
      label: "T+00:00:00",
      expired: true,
      accessibleLabel: "Launch time has arrived or passed"
    };
  }

  const accessibleParts = [];
  if (hours > 0) {
    accessibleParts.push(`${hours} hour${hours === 1 ? "" : "s"}`);
  }
  if (minutes > 0) {
    accessibleParts.push(`${minutes} minute${minutes === 1 ? "" : "s"}`);
  }

  return {
    label,
    expired: false,
    accessibleLabel: `Launch scheduled in approximately ${accessibleParts.join(" ") || "less than 1 minute"}`
  };
}

export function launchVehicleName(launch: Launch) {
  return launch.rocket?.name ?? launch.rocket?.full_name ?? launch.name.split("|")[0]?.trim() ?? "Launch";
}

export function launchMissionName(launch: Launch) {
  return launch.mission?.name ?? launch.name.split("|")[1]?.trim() ?? launch.name;
}

export function apiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "";
}

export function launchFixturesEnabled() {
  return process.env.NEXT_PUBLIC_ENABLE_LAUNCH_FIXTURES === "true";
}

export async function getLaunchFeed(): Promise<LaunchFeedState> {
  const baseUrl = apiBaseUrl();

  if (!baseUrl) {
    if (launchFixturesEnabled()) {
      return {
        status: "ready",
        launches: developmentLaunches,
        dataFreshness: "stale",
        lastUpdatedAt: developmentLaunches[0]?.last_updated_at ?? null
      };
    }

    return {
      status: "unavailable",
      launches: [],
      dataFreshness: "unavailable",
      lastUpdatedAt: null,
      reason: "api_not_configured"
    };
  }

  try {
    const response = await fetch(`${baseUrl}/api/v1/public/launches/upcoming`, {
      next: { revalidate: 300 }
    });

    if (!response.ok) {
      throw new Error(`Launch API returned ${response.status}`);
    }

    const payload = (await response.json()) as LaunchesResponse;
    return {
      status: "ready",
      launches: payload.data,
      dataFreshness: payload.data_freshness,
      lastUpdatedAt: payload.last_updated_at
    };
  } catch {
    return {
      status: "unavailable",
      launches: [],
      dataFreshness: "unavailable",
      lastUpdatedAt: null,
      reason: "api_error"
    };
  }
}
