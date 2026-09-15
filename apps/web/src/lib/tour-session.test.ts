import { createTourSession } from "@space-coast-explorer/maps";
import { beforeEach, describe, expect, it } from "vitest";
import { finishTourSession, loadTourSession } from "./tour-session";

describe("tour session storage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("allows a visitor to finish a tour before every stop is completed", () => {
    const session = createTourSession("cocoa-village-historic-explorer", "parrish-grove-inn");

    const finished = finishTourSession(session);

    expect(finished.tourCompleted).toBe(true);
    expect(finished.completedStopSlugs).toEqual([]);
    expect(loadTourSession(session.tourSlug)).toEqual(finished);
  });
});
