"use client";

import { distanceMeters, type LocationReading } from "@space-coast-explorer/maps";
import type { TourDetail } from "@space-coast-explorer/types";

export function canUseDevLocationSimulator() {
  return process.env.NODE_ENV !== "production";
}

export type SimulatedLocationScenario = "far" | "approach" | "arrive" | "jitter" | "exit" | "poor-accuracy";

export type SimulatedWalkMode = "realistic" | "fast" | "faster" | "instant";

export const simulatedWalkModes: Record<SimulatedWalkMode, { label: string; multiplier: number }> = {
  realistic: { label: "1x", multiplier: 1 },
  fast: { label: "5x", multiplier: 5 },
  faster: { label: "10x", multiplier: 10 },
  instant: { label: "Instant", multiplier: Number.POSITIVE_INFINITY }
};

export type SimulatedWalkStop = {
  sequence: number;
  slug: string;
  title: string;
  location: {
    latitude: number;
    longitude: number;
  };
};

export type SimulatedWalkState = {
  active: boolean;
  paused: boolean;
  currentIndex: number;
  targetIndex: number;
  progressOnSegment: number;
  mode: SimulatedWalkMode;
  accuracy: number;
  driftMeters: number;
  permissionUnavailable: boolean;
};

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

export function mappableTourStops(tour: TourDetail): SimulatedWalkStop[] {
  return tour.stops.flatMap((stop) =>
    stop.location
      ? [
          {
            sequence: stop.sequence,
            slug: stop.slug,
            title: stop.title,
            location: stop.location
          }
        ]
      : []
  );
}

export function initialSimulatedWalkState(): SimulatedWalkState {
  return {
    active: false,
    paused: false,
    currentIndex: 0,
    targetIndex: 1,
    progressOnSegment: 0,
    mode: "realistic",
    accuracy: 12,
    driftMeters: 0,
    permissionUnavailable: false
  };
}

export function simulatedWalkReading(stops: SimulatedWalkStop[], state: SimulatedWalkState, now = Date.now()): LocationReading | undefined {
  const currentStop = stops[state.currentIndex];
  const targetStop = stops[state.targetIndex] ?? currentStop;

  if (!currentStop || !targetStop || state.permissionUnavailable) {
    return undefined;
  }

  const progress = Math.min(Math.max(state.progressOnSegment, 0), 1);
  const driftDegrees = state.driftMeters / 111_111;

  return {
    latitude: currentStop.location.latitude + (targetStop.location.latitude - currentStop.location.latitude) * progress + driftDegrees,
    longitude: currentStop.location.longitude + (targetStop.location.longitude - currentStop.location.longitude) * progress,
    accuracy: state.accuracy,
    timestamp: now
  };
}

export function advanceSimulatedWalk(stops: SimulatedWalkStop[], state: SimulatedWalkState, elapsedSeconds = 1): SimulatedWalkState {
  if (!state.active || state.paused || state.permissionUnavailable || stops.length < 1) {
    return state;
  }

  const currentStop = stops[state.currentIndex];
  const targetStop = stops[state.targetIndex];

  if (!currentStop || !targetStop) {
    return { ...state, active: false, paused: false, progressOnSegment: 0 };
  }

  if (state.mode === "instant") {
    const nextCurrentIndex = state.targetIndex;
    return {
      ...state,
      currentIndex: nextCurrentIndex,
      targetIndex: Math.min(nextCurrentIndex + 1, stops.length - 1),
      progressOnSegment: 0,
      active: nextCurrentIndex < stops.length - 1
    };
  }

  const segmentMeters = Math.max(distanceMeters(currentStop.location, targetStop.location), 1);
  const metersPerSecond = 1.4 * simulatedWalkModes[state.mode].multiplier;
  const progressDelta = (metersPerSecond * elapsedSeconds) / segmentMeters;
  const nextProgress = state.progressOnSegment + progressDelta;

  if (nextProgress < 1) {
    return { ...state, progressOnSegment: nextProgress };
  }

  const nextCurrentIndex = state.targetIndex;
  return {
    ...state,
    currentIndex: nextCurrentIndex,
    targetIndex: Math.min(nextCurrentIndex + 1, stops.length - 1),
    progressOnSegment: 0,
    active: nextCurrentIndex < stops.length - 1
  };
}

export function simulatedDistanceToTarget(stops: SimulatedWalkStop[], state: SimulatedWalkState) {
  const reading = simulatedWalkReading(stops, state);
  const targetStop = stops[state.targetIndex];

  if (!reading || !targetStop) {
    return undefined;
  }

  return distanceMeters(reading, targetStop.location);
}
