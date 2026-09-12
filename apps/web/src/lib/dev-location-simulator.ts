"use client";

import type { LocationReading } from "@space-coast-explorer/maps";
import type { TourDetail } from "@space-coast-explorer/types";

export function canUseDevLocationSimulator() {
  return process.env.NODE_ENV !== "production";
}

export type SimulatedLocationScenario = "far" | "approach" | "arrive" | "jitter" | "exit" | "poor-accuracy";

export function simulatedReadingForScenario(tour: TourDetail, scenario: SimulatedLocationScenario): LocationReading | undefined {
  const firstStop = tour.stops.find((stop) => stop.location);
  if (!firstStop?.location) {
    return undefined;
  }

  const timestamp = Date.now();

  if (scenario === "far") {
    return { latitude: firstStop.location.latitude + 0.004, longitude: firstStop.location.longitude + 0.004, accuracy: 12, timestamp };
  }

  if (scenario === "approach") {
    return { latitude: firstStop.location.latitude + 0.0008, longitude: firstStop.location.longitude, accuracy: 12, timestamp };
  }

  if (scenario === "jitter") {
    return { latitude: firstStop.location.latitude + 0.00031, longitude: firstStop.location.longitude, accuracy: 12, timestamp };
  }

  if (scenario === "exit") {
    return { latitude: firstStop.location.latitude + 0.00062, longitude: firstStop.location.longitude, accuracy: 12, timestamp };
  }

  if (scenario === "poor-accuracy") {
    return { latitude: firstStop.location.latitude, longitude: firstStop.location.longitude, accuracy: 120, timestamp };
  }

  return { latitude: firstStop.location.latitude, longitude: firstStop.location.longitude, accuracy: 10, timestamp };
}
