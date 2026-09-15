import type { PremiumFeature, UserEntitlements } from "@space-coast-explorer/types";

export const explorerPassPriceLabel = "$5.99";
export const explorerPassDurationHours = 24;

export const explorerPassEntitlements: PremiumFeature[] = [
  "full_stories",
  "audio_guides",
  "then_and_now",
  "bonus_stops",
  "multiple_saved_tours",
  "smart_nearby",
  "ai_local_guide",
  "offline_access",
  "custom_itineraries",
  "cruise_planner"
];

const entitlementStorageKey = "space-coast-explorer:explorer-pass";

type StoredExplorerPass = {
  plan: "explorer_pass";
  status: UserEntitlements["status"];
  startsAt: string;
  expiresAt: string;
  provider?: "development";
  providerReference?: string;
};

export const freeEntitlements: UserEntitlements = {
  plan: "free",
  entitlements: [],
  status: "inactive"
};

export function isDevelopmentExplorerPassEnabled() {
  return process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_ENABLE_DEV_EXPLORER_PASS === "true";
}

function parseStoredPass(raw: string | null): StoredExplorerPass | undefined {
  if (!raw) {
    return undefined;
  }

  try {
    return JSON.parse(raw) as StoredExplorerPass;
  } catch {
    window.localStorage.removeItem(entitlementStorageKey);
    return undefined;
  }
}

export function loadUserEntitlements(now = new Date()): UserEntitlements {
  if (typeof window === "undefined") {
    return freeEntitlements;
  }

  const stored = parseStoredPass(window.localStorage.getItem(entitlementStorageKey));
  if (!stored || stored.status !== "active") {
    return freeEntitlements;
  }

  if (Date.parse(stored.expiresAt) <= now.getTime()) {
    const expired = { ...stored, status: "expired" as const };
    window.localStorage.setItem(entitlementStorageKey, JSON.stringify(expired));
    return { ...freeEntitlements, status: "expired" };
  }

  return {
    plan: "explorer_pass",
    entitlements: explorerPassEntitlements,
    startsAt: stored.startsAt,
    expiresAt: stored.expiresAt,
    status: "active"
  };
}

export function hasEntitlement(userEntitlements: UserEntitlements, entitlement: PremiumFeature) {
  return userEntitlements.status === "active" && userEntitlements.entitlements.includes(entitlement);
}

export function activateDevelopmentExplorerPass(now = new Date()) {
  if (!isDevelopmentExplorerPassEnabled()) {
    return loadUserEntitlements(now);
  }

  const expiresAt = new Date(now.getTime() + explorerPassDurationHours * 60 * 60 * 1000);
  const stored: StoredExplorerPass = {
    plan: "explorer_pass",
    provider: "development",
    providerReference: `dev-pass-${now.getTime()}`,
    status: "active",
    startsAt: now.toISOString(),
    expiresAt: expiresAt.toISOString()
  };
  window.localStorage.setItem(entitlementStorageKey, JSON.stringify(stored));
  return loadUserEntitlements(now);
}

export function expireDevelopmentExplorerPass(now = new Date()) {
  if (!isDevelopmentExplorerPassEnabled()) {
    return loadUserEntitlements(now);
  }

  const expiredAt = new Date(now.getTime() - 1000).toISOString();
  const stored: StoredExplorerPass = {
    plan: "explorer_pass",
    provider: "development",
    providerReference: `dev-expired-${now.getTime()}`,
    status: "expired",
    startsAt: expiredAt,
    expiresAt: expiredAt
  };
  window.localStorage.setItem(entitlementStorageKey, JSON.stringify(stored));
  return { ...freeEntitlements, status: "expired" as const };
}
