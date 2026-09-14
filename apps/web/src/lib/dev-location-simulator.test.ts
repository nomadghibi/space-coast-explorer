import { describe, expect, it } from "vitest";
import {
  advanceSimulatedWalk,
  initialSimulatedWalkState,
  mappableTourStops,
  simulatedDistanceToTarget,
  simulatedWalkReading
} from "./dev-location-simulator";
import { getTour } from "./content";

describe("development location simulator", () => {
  it("uses current mapped tour stops instead of a duplicate coordinate list", () => {
    const tour = getTour("cocoa-village-historic-explorer");

    expect(tour).toBeDefined();
    expect(mappableTourStops(tour!)).toHaveLength(10);
  });

  it("interpolates a walking reading between stops", () => {
    const tour = getTour("cocoa-village-historic-explorer")!;
    const stops = mappableTourStops(tour);
    const state = { ...initialSimulatedWalkState(), active: true, progressOnSegment: 0.5 };
    const reading = simulatedWalkReading(stops, state, Date.UTC(2026, 8, 14));

    expect(reading?.timestamp).toBe(Date.UTC(2026, 8, 14));
    expect(reading?.latitude).toBeGreaterThan(Math.min(stops[0]!.location.latitude, stops[1]!.location.latitude));
    expect(reading?.latitude).toBeLessThan(Math.max(stops[0]!.location.latitude, stops[1]!.location.latitude));
    expect(simulatedDistanceToTarget(stops, state)).toBeGreaterThan(0);
  });

  it("walks instantly to the target stop in instant mode", () => {
    const tour = getTour("cocoa-village-historic-explorer")!;
    const stops = mappableTourStops(tour);
    const next = advanceSimulatedWalk(stops, {
      ...initialSimulatedWalkState(),
      active: true,
      mode: "instant"
    });

    expect(next.currentIndex).toBe(1);
    expect(next.targetIndex).toBe(2);
  });
});
