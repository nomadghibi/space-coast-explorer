"use client";

import type { AnalyticsEventName, CompletionMethod } from "@space-coast-explorer/analytics";
import type { TourDetail } from "@space-coast-explorer/types";

const analyticsStorageKey = "space-coast-explorer:visitor-analytics";
const sessionStorageKey = "space-coast-explorer:visitor-session-id";

type VisitorAnalyticsEvent = {
  eventName: AnalyticsEventName;
  visitorSessionId: string;
  destinationSlug: string;
  tourSlug: string;
  occurredAt: string;
  payload: {
    completionMethod?: CompletionMethod;
    completedStops?: number;
    totalStops?: number;
    stopSlug?: string;
    feature?: string;
    plan?: "free" | "explorer_pass";
    source?: string;
    upgradeTrigger?: string;
  };
  delivered: boolean;
};

function browserCryptoId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function getVisitorSessionId() {
  if (typeof window === "undefined") {
    return "server-render";
  }

  const existing = window.localStorage.getItem(sessionStorageKey);
  if (existing) {
    return existing;
  }

  const created = browserCryptoId();
  window.localStorage.setItem(sessionStorageKey, created);
  return created;
}

function loadStoredEvents() {
  if (typeof window === "undefined") {
    return [] as VisitorAnalyticsEvent[];
  }

  const raw = window.localStorage.getItem(analyticsStorageKey);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as VisitorAnalyticsEvent[];
  } catch {
    window.localStorage.removeItem(analyticsStorageKey);
    return [];
  }
}

function saveStoredEvents(events: VisitorAnalyticsEvent[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(analyticsStorageKey, JSON.stringify(events.slice(-50)));
}

async function submitToApi(event: VisitorAnalyticsEvent) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const destinationId = process.env.NEXT_PUBLIC_ANALYTICS_DESTINATION_ID;
  const tourId = process.env.NEXT_PUBLIC_ANALYTICS_TOUR_ID;
  const enabled = process.env.NEXT_PUBLIC_ANALYTICS_API_ENABLED === "true";

  if (!enabled || !apiBaseUrl || !destinationId || !tourId) {
    return false;
  }

  const response = await fetch(`${apiBaseUrl}/api/v1/analytics/events`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      destination_id: destinationId,
      tour_id: tourId,
      visitor_session_id: event.visitorSessionId,
      event_name: event.eventName,
      occurred_at: event.occurredAt,
      payload: {
        ...event.payload,
        destination_slug: event.destinationSlug,
        tour_slug: event.tourSlug
      }
    }),
    keepalive: true
  });

  return response.ok;
}

export async function recordVisitorAnalyticsEvent(
  tour: TourDetail,
  eventName: AnalyticsEventName,
  payload: VisitorAnalyticsEvent["payload"] = {}
) {
  const event: VisitorAnalyticsEvent = {
    eventName,
    visitorSessionId: getVisitorSessionId(),
    destinationSlug: tour.destinationSlug,
    tourSlug: tour.slug,
    occurredAt: new Date().toISOString(),
    payload,
    delivered: false
  };

  const events = loadStoredEvents();
  events.push(event);
  saveStoredEvents(events);

  try {
    const delivered = await submitToApi(event);
    if (delivered) {
      saveStoredEvents(events.map((stored) => (stored === event ? { ...stored, delivered } : stored)));
    }
  } catch {
    saveStoredEvents(events);
  }
}

export function getStoredVisitorAnalyticsEvents() {
  return loadStoredEvents();
}
