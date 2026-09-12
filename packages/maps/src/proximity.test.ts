import { describe, expect, it } from "vitest";
import {
  createTourSession,
  distanceMeters,
  evaluateStopProximity,
  markStopCompleted,
  recordArrival,
  type LocationReading,
  type ProximityStop
} from "./index";

const stop: ProximityStop = {
  slug: "village-welcome",
  sequence: 1,
  location: { latitude: 28.35532, longitude: -80.72606 },
  triggerRadiusMeters: 35,
  exitRadiusMeters: 60
};

function reading(latitude: number, longitude: number, accuracy = 12): LocationReading {
  return { latitude, longitude, accuracy, timestamp: Date.UTC(2026, 8, 12) };
}

describe("proximity engine", () => {
  it("calculates known coordinate distances with Haversine", () => {
    const distance = distanceMeters(
      { latitude: 28.35532, longitude: -80.72606 },
      { latitude: 28.35493, longitude: -80.72384 }
    );

    expect(distance).toBeGreaterThan(215);
    expect(distance).toBeLessThan(225);
  });

  it("detects arrival inside the trigger radius", () => {
    const result = evaluateStopProximity(stop, reading(28.35534, -80.72605));

    expect(result.state).toBe("arrived");
    expect(result.arrivalTriggered).toBe(true);
  });

  it("does not trigger arrival outside the radius", () => {
    const result = evaluateStopProximity(stop, reading(28.35493, -80.72384));

    expect(result.state).toBe("not_started");
    expect(result.arrivalTriggered).toBe(false);
  });

  it("uses hysteresis between trigger and exit radii", () => {
    const inside = evaluateStopProximity(stop, reading(28.35534, -80.72605));
    const jitter = evaluateStopProximity(stop, reading(28.35572, -80.72606), inside.state);
    const outside = evaluateStopProximity(stop, reading(28.356, -80.72606), jitter.state);

    expect(jitter.state).toBe("arrived");
    expect(jitter.arrivalTriggered).toBe(false);
    expect(outside.state).toBe("approaching");
  });

  it("does not emit repeated arrivals during GPS jitter", () => {
    const first = evaluateStopProximity(stop, reading(28.35534, -80.72605));
    const second = evaluateStopProximity(stop, reading(28.35535, -80.72607), first.state);

    expect(first.arrivalTriggered).toBe(true);
    expect(second.arrivalTriggered).toBe(false);
  });

  it("ignores poor accuracy readings for arrival", () => {
    const result = evaluateStopProximity(stop, reading(28.35534, -80.72605, 90));

    expect(result.accuracyUsable).toBe(false);
    expect(result.state).toBe("not_started");
    expect(result.arrivalTriggered).toBe(false);
  });

  it("records duplicate arrival once", () => {
    const session = createTourSession("cocoa-village-historic-explorer", "village-welcome");
    const arrived = recordArrival(session, "village-welcome");
    const duplicate = recordArrival(arrived, "village-welcome");

    expect(duplicate.arrivedStopSlugs).toEqual(["village-welcome"]);
  });

  it("completes the tour when the final stop is completed", () => {
    const session = {
      ...createTourSession("cocoa-village-historic-explorer", "one"),
      completedStopSlugs: ["one"]
    };
    const completed = markStopCompleted(session, ["one", "two"], "two");

    expect(completed.tourCompleted).toBe(true);
    expect(completed.completedStopSlugs).toEqual(["one", "two"]);
  });
});
