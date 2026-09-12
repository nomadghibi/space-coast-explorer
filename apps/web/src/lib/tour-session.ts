"use client";

import {
  createTourSession,
  markStopCompleted,
  recordArrival,
  type TourSessionState
} from "@space-coast-explorer/maps";

const storagePrefix = "space-coast-explorer:tour-session:";

export function sessionStorageKey(tourSlug: string) {
  return `${storagePrefix}${tourSlug}`;
}

export function loadTourSession(tourSlug: string): TourSessionState | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  const raw = window.localStorage.getItem(sessionStorageKey(tourSlug));
  if (!raw) {
    return undefined;
  }

  try {
    return JSON.parse(raw) as TourSessionState;
  } catch {
    window.localStorage.removeItem(sessionStorageKey(tourSlug));
    return undefined;
  }
}

export function saveTourSession(session: TourSessionState) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(sessionStorageKey(session.tourSlug), JSON.stringify(session));
}

export function startTourSession(tourSlug: string, firstStopSlug: string) {
  const existing = loadTourSession(tourSlug);
  const session = existing ?? createTourSession(tourSlug, firstStopSlug);
  saveTourSession(session);
  return session;
}

export function setLocationEnabled(session: TourSessionState, locationEnabled: boolean) {
  const next = { ...session, locationEnabled };
  saveTourSession(next);
  return next;
}

export function arriveAtStop(session: TourSessionState, stopSlug: string) {
  const next = recordArrival(session, stopSlug);
  saveTourSession(next);
  return next;
}

export function completeStop(session: TourSessionState, orderedStopSlugs: string[], stopSlug: string) {
  const next = markStopCompleted(session, orderedStopSlugs, stopSlug);
  saveTourSession(next);
  return next;
}

export function clearTourSession(tourSlug: string) {
  window.localStorage.removeItem(sessionStorageKey(tourSlug));
}
