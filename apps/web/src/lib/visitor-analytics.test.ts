import { beforeEach, describe, expect, it, vi } from "vitest";
import { tours } from "./content";
import { getStoredVisitorAnalyticsEvents, recordVisitorAnalyticsEvent } from "./visitor-analytics";

describe("visitor analytics", () => {
  const storage = new Map<string, string>();

  beforeEach(() => {
    storage.clear();
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: {
        getItem: (key: string) => storage.get(key) ?? null,
        removeItem: (key: string) => storage.delete(key),
        setItem: (key: string, value: string) => storage.set(key, value),
        clear: () => storage.clear()
      }
    });
    window.localStorage.clear();
    vi.stubGlobal("fetch", vi.fn());
  });

  it("stores visitor tour events locally without raw location data", async () => {
    const tour = tours[0]!;

    await recordVisitorAnalyticsEvent(tour, "visitor_experience.completed", {
      completionMethod: "manual",
      completedStops: 10,
      totalStops: 10
    });

    const events = getStoredVisitorAnalyticsEvents();
    expect(events).toHaveLength(1);
    expect(events[0]?.eventName).toBe("visitor_experience.completed");
    expect(events[0]?.destinationSlug).toBe("cocoa-village");
    expect(events[0]?.tourSlug).toBe("cocoa-village-historic-explorer");
    expect(JSON.stringify(events[0])).not.toMatch(/latitude|longitude|accuracy/i);
    expect(fetch).not.toHaveBeenCalled();
  });
});
