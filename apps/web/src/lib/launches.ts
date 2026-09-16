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
  scheduled: "bg-sky-100 text-sky-950",
  go: "bg-emerald-100 text-emerald-950",
  hold: "bg-amber-100 text-amber-950",
  delayed: "bg-orange-100 text-orange-950",
  scrubbed: "bg-rose-100 text-rose-950",
  launched: "bg-indigo-100 text-indigo-950",
  success: "bg-emerald-100 text-emerald-950",
  failure: "bg-rose-100 text-rose-950",
  unknown: "bg-slate-100 text-slate-800"
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

export function apiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "";
}

export async function getLaunchFeed(): Promise<LaunchFeedState> {
  const baseUrl = apiBaseUrl();

  if (!baseUrl) {
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
