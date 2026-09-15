"use client";

import "maplibre-gl/dist/maplibre-gl.css";

import {
  createTourSession,
  defaultProximityOptions,
  distanceMeters,
  evaluateStopProximity,
  formatDistance,
  progressPercent,
  type LocationReading,
  type ProximityStop,
  type StopProximityState,
  type TourSessionState
} from "@space-coast-explorer/maps";
import type { TourDetail } from "@space-coast-explorer/types";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  advanceSimulatedWalk,
  canUseDevLocationSimulator,
  initialSimulatedWalkState,
  mappableTourStops,
  simulatedDistanceToTarget,
  simulatedReadingForScenario,
  simulatedWalkModes,
  simulatedWalkReading,
  type SimulatedLocationScenario,
  type SimulatedWalkMode
} from "../lib/dev-location-simulator";
import { getTourStopImage } from "../lib/content";
import { googleMapsDirectionsUrl } from "../lib/map-links";
import { arriveAtStop, clearTourSession, completeStop, finishTourSession, loadTourSession, setLocationEnabled, startTourSession } from "../lib/tour-session";
import { useForegroundLocation } from "../lib/use-foreground-location";
import { recordVisitorAnalyticsEvent } from "../lib/visitor-analytics";
import { EngagementUpgradePrompt } from "./engagement-upgrade-prompt";
import { PremiumUpgradeCard } from "./premium-upgrade-card";

const defaultMapStyleUrl = "https://demotiles.maplibre.org/style.json";

function stopToProximity(stop: TourDetail["stops"][number]): ProximityStop | undefined {
  if (!stop.location || !stop.triggerRadiusMeters || !stop.exitRadiusMeters) {
    return undefined;
  }

  return {
    slug: stop.slug,
    sequence: stop.sequence,
    location: stop.location,
    triggerRadiusMeters: stop.triggerRadiusMeters,
    exitRadiusMeters: stop.exitRadiusMeters
  };
}

function mapCoordinates(point: { latitude: number; longitude: number }): [number, number] {
  return [point.longitude, point.latitude];
}

function completedMappedDistanceMeters(tour: TourDetail, completedStopSlugs: string[]) {
  const completed = new Set(completedStopSlugs);
  const mappedStops = tour.stops.filter((stop) => stop.location);
  const furthestCompletedMappedIndex = mappedStops.reduce(
    (furthestIndex, stop, index) => (completed.has(stop.slug) ? index : furthestIndex),
    -1
  );

  if (furthestCompletedMappedIndex <= 0) {
    return 0;
  }

  return mappedStops.slice(1, furthestCompletedMappedIndex + 1).reduce((total, stop, index) => {
    const previousStop = mappedStops[index];

    if (!previousStop?.location || !stop.location) {
      return total;
    }

    return total + distanceMeters(previousStop.location, stop.location);
  }, 0);
}

function nextMappedLegDistanceMeters(currentStop: TourDetail["stops"][number] | undefined, nextStop: TourDetail["stops"][number] | undefined) {
  if (!currentStop?.location || !nextStop?.location) {
    return undefined;
  }

  return distanceMeters(currentStop.location, nextStop.location);
}

function formatElapsedTourTime(startedAt: string, now: number) {
  const startedAtMs = Date.parse(startedAt);

  if (!Number.isFinite(startedAtMs)) {
    return "0 min";
  }

  const elapsedMinutes = Math.max(0, Math.floor((now - startedAtMs) / 60_000));

  if (elapsedMinutes < 60) {
    return `${elapsedMinutes} min`;
  }

  const hours = Math.floor(elapsedMinutes / 60);
  const minutes = elapsedMinutes % 60;

  return minutes ? `${hours} hr ${minutes} min` : `${hours} hr`;
}

export function ActiveTour({ tour }: { tour: TourDetail }) {
  const orderedStopSlugs = useMemo(() => tour.stops.map((stop) => stop.slug), [tour.stops]);
  const firstStopSlug = orderedStopSlugs[0] ?? "";
  const [session, setSession] = useState<TourSessionState>(() =>
    createTourSession(tour.slug, firstStopSlug, new Date("2026-09-12T00:00:00.000Z"))
  );
  const [showResume, setShowResume] = useState(false);
  const [simulatedReading, setSimulatedReading] = useState<LocationReading | undefined>();
  const [simulatedWalk, setSimulatedWalk] = useState(initialSimulatedWalkState);
  const [permissionChoiceMade, setPermissionChoiceMade] = useState(false);
  const [mapError, setMapError] = useState<string | undefined>();
  const [activeTab, setActiveTab] = useState<"map" | "stops" | "info">("map");
  const [selectedMapStopSlug, setSelectedMapStopSlug] = useState<string | undefined>();
  const [stopStates, setStopStates] = useState<Record<string, StopProximityState>>({});
  const [now, setNow] = useState(() => Date.now());
  const location = useForegroundLocation();
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<import("maplibre-gl").Map | undefined>(undefined);
  const userMarkerRef = useRef<import("maplibre-gl").Marker | undefined>(undefined);
  const startTrackedRef = useRef(false);
  const completionTrackedRef = useRef(false);
  const styleUrl = process.env.NEXT_PUBLIC_MAP_STYLE_URL ?? defaultMapStyleUrl;
  const mappableStops = useMemo(() => tour.stops.map(stopToProximity).filter((stop): stop is ProximityStop => Boolean(stop)), [tour.stops]);
  const simulatedWalkStops = useMemo(() => mappableTourStops(tour), [tour]);
  const stopDetailsBySlug = useMemo(() => new Map(tour.stops.map((stop) => [stop.slug, stop])), [tour.stops]);
  const currentStop = tour.stops.find((stop) => stop.slug === session.currentStopSlug) ?? tour.stops[0];
  const currentStopIndex = currentStop ? tour.stops.findIndex((stop) => stop.slug === currentStop.slug) : -1;
  const previousStop = currentStopIndex > 0 ? tour.stops[currentStopIndex - 1] : undefined;
  const nextStop = currentStopIndex >= 0 && currentStopIndex < tour.stops.length - 1 ? tour.stops[currentStopIndex + 1] : undefined;
  const selectedMapStop = tour.stops.find((stop) => stop.slug === selectedMapStopSlug) ?? currentStop;
  const selectedMapStopImage = selectedMapStop ? getTourStopImage(tour, selectedMapStop) : undefined;
  const simulatedWalkActiveReading = simulatedWalk.active || simulatedWalk.permissionUnavailable
    ? simulatedWalkReading(simulatedWalkStops, simulatedWalk)
    : undefined;
  const activeReading = simulatedWalkActiveReading ?? simulatedReading ?? location.reading;
  const simulatedTargetDistance = simulatedDistanceToTarget(simulatedWalkStops, simulatedWalk);
  const currentDistance = currentStop?.location && activeReading ? formatDistance(evaluateStopProximity(stopToProximity(currentStop)!, activeReading).distanceMeters) : undefined;
  const completedCount = session.completedStopSlugs.length;
  const percent = progressPercent(completedCount, tour.stopCount);
  const traveledDistance = formatDistance(completedMappedDistanceMeters(tour, session.completedStopSlugs));
  const nextLegDistance = nextMappedLegDistanceMeters(currentStop, nextStop);
  const nextLegDistanceLabel = nextLegDistance === undefined ? "pending map pin" : formatDistance(nextLegDistance);
  const elapsedTourTime = formatElapsedTourTime(session.startedAt, now);
  const accuracyWeak = activeReading ? activeReading.accuracy > defaultProximityOptions.maximumUsefulAccuracyMeters : false;
  const mapReady = Boolean(tour.routeGeometry && mappableStops.length && !mapError);
  const currentStopArrived = currentStop ? session.arrivedStopSlugs.includes(currentStop.slug) : false;
  const currentDirectionsUrl = googleMapsDirectionsUrl(currentStop?.location ?? tour.startPoint?.address ?? tour.startLocation);
  const selectMapStop = (stop: TourDetail["stops"][number]) => {
    setSelectedMapStopSlug(stop.slug);

    if (stop.location && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo({
        center: mapCoordinates(stop.location),
        duration: 700,
        essential: true,
        zoom: 17
      });
    }
  };

  useEffect(() => {
    const existing = loadTourSession(tour.slug);
    if (existing && existing.completedStopSlugs.length > 0 && !existing.tourCompleted) {
      queueMicrotask(() => {
        setSession(existing);
        setShowResume(true);
      });
      return;
    }

    const started = startTourSession(tour.slug, firstStopSlug);
    if (!startTrackedRef.current) {
      startTrackedRef.current = true;
      void recordVisitorAnalyticsEvent(tour, "visitor_experience.started", {
        totalStops: tour.stopCount
      });
    }
    queueMicrotask(() => setSession(started));
  }, [firstStopSlug, tour, tour.slug]);

  useEffect(() => {
    if (!activeReading || !currentStop) {
      return;
    }

    const proximityStop = stopToProximity(currentStop);
    if (!proximityStop) {
      return;
    }

    const previousState = session.completedStopSlugs.includes(currentStop.slug)
      ? "completed"
      : stopStates[currentStop.slug] ?? "not_started";
    const result = evaluateStopProximity(proximityStop, activeReading, previousState);
    if (result.state !== previousState) {
      queueMicrotask(() => setStopStates((states) => ({ ...states, [currentStop.slug]: result.state })));
    }

    if (result.arrivalTriggered) {
      const next = arriveAtStop(session, currentStop.slug);
      queueMicrotask(() => setSession(next));
    }
  }, [activeReading, currentStop, session, stopStates]);

  useEffect(() => {
    if (!canUseDevLocationSimulator() || !simulatedWalk.active || simulatedWalk.paused) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setSimulatedWalk((state) => advanceSimulatedWalk(simulatedWalkStops, state));
    }, 1_000);

    return () => window.clearInterval(intervalId);
  }, [simulatedWalk.active, simulatedWalk.paused, simulatedWalkStops]);

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(Date.now()), 60_000);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (session.tourCompleted || !mapRef.current || !tour.routeGeometry || mapInstanceRef.current || !styleUrl) {
      return;
    }

    let disposed = false;

    async function initMap() {
      try {
        const maplibregl = await import("maplibre-gl");
        const routeGeometry = tour.routeGeometry;
        const firstCoordinate = routeGeometry?.coordinates[0];
        if (disposed || !mapRef.current || !routeGeometry || !firstCoordinate) {
          return;
        }

        const bounds = new maplibregl.LngLatBounds();
        for (const coordinate of routeGeometry.coordinates) {
          bounds.extend(mapCoordinates(coordinate));
        }

        const map = new maplibregl.Map({
          container: mapRef.current,
          style: styleUrl,
          center: mapCoordinates(firstCoordinate),
          zoom: 16,
          attributionControl: {}
        });

        map.on("load", () => {
          map.addSource("tour-route", {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: routeGeometry.coordinates.map(mapCoordinates)
              }
            }
          });
          map.addLayer({
            id: "tour-route-line",
            type: "line",
            source: "tour-route",
            paint: { "line-color": "#0f766e", "line-width": 5, "line-opacity": 0.9 }
          });

          for (const stop of mappableStops) {
            const stopDetails = stopDetailsBySlug.get(stop.slug);
            const element = document.createElement("div");
            element.className = "tour-map-marker";
            element.setAttribute("aria-label", `Stop ${stop.sequence}: ${stopDetails?.title ?? stop.slug}`);
            element.setAttribute("title", `Stop ${stop.sequence}: ${stopDetails?.title ?? stop.slug}`);
            element.setAttribute("role", "button");
            element.setAttribute("tabindex", "0");
            element.textContent = String(stop.sequence);
            const popup = new maplibregl.Popup({ closeButton: true, offset: 28 }).setText(
              `Stop ${stop.sequence}: ${stopDetails?.title ?? stop.slug}`
            );
            const selectStop = () => {
              setSelectedMapStopSlug(stop.slug);
              popup.setLngLat(mapCoordinates(stop.location)).addTo(map);
            };
            element.addEventListener("click", selectStop);
            element.addEventListener("keydown", (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                selectStop();
              }
            });
            new maplibregl.Marker({ element })
              .setLngLat(mapCoordinates(stop.location))
              .setPopup(popup)
              .addTo(map);
          }

          map.fitBounds(bounds, { padding: 56, maxZoom: 17 });
        });

        map.on("error", () => setMapError("The map is unavailable right now. You can continue with the stop list."));
        mapInstanceRef.current = map;
      } catch {
        setMapError("The map is unavailable right now. You can continue with the stop list.");
      }
    }

    void initMap();

    return () => {
      disposed = true;
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = undefined;
    };
  }, [mappableStops, session.tourCompleted, stopDetailsBySlug, styleUrl, tour.routeGeometry]);

  useEffect(() => {
    if (!activeReading || !mapInstanceRef.current) {
      return;
    }

    import("maplibre-gl").then((maplibregl) => {
      if (!mapInstanceRef.current) {
        return;
      }

      if (!userMarkerRef.current) {
        const element = document.createElement("div");
        element.className = "visitor-map-marker";
        userMarkerRef.current = new maplibregl.Marker({ element })
          .setLngLat(mapCoordinates(activeReading))
          .addTo(mapInstanceRef.current);
        return;
      }
      userMarkerRef.current.setLngLat(mapCoordinates(activeReading));
    });
  }, [activeReading]);

  function enableLocation() {
    const next = setLocationEnabled(session, true);
    setSession(next);
    setPermissionChoiceMade(true);
    location.start();
  }

  function continueWithoutLocation() {
    const next = setLocationEnabled(session, false);
    setSession(next);
    setPermissionChoiceMade(true);
  }

  function markCurrentStopCompleted(stopSlug: string) {
    const next = completeStop(session, orderedStopSlugs, stopSlug);
    setSession(next);
    void recordVisitorAnalyticsEvent(tour, "tour_stop.completed", {
      plan: "free",
      stopSlug,
      totalStops: tour.stopCount
    });
    if (next.tourCompleted && !completionTrackedRef.current) {
      completionTrackedRef.current = true;
      void recordVisitorAnalyticsEvent(tour, "visitor_experience.completed", {
        completionMethod: "manual",
        completedStops: next.completedStopSlugs.length,
        totalStops: tour.stopCount
      });
    }
  }

  function finishTourNow() {
    const next = finishTourSession(session);
    setSession(next);
    if (!completionTrackedRef.current) {
      completionTrackedRef.current = true;
      void recordVisitorAnalyticsEvent(tour, "visitor_experience.completed", {
        completionMethod: "manual",
        completedStops: next.completedStopSlugs.length,
        totalStops: tour.stopCount
      });
    }
  }

  function restartTour() {
    clearTourSession(tour.slug);
    const restarted = startTourSession(tour.slug, firstStopSlug);
    setSession(restarted);
    setShowResume(false);
    setPermissionChoiceMade(false);
    setActiveTab("map");
    setStopStates({});
    completionTrackedRef.current = false;
  }

  function simulate(scenario: SimulatedLocationScenario) {
    const simulated = simulatedReadingForScenario(tour, scenario);
    if (simulated) {
      setSimulatedReading(simulated);
      setSimulatedWalk((state) => ({ ...state, active: false, paused: false, permissionUnavailable: false }));
    }
  }

  function startSimulatedWalk() {
    setPermissionChoiceMade(true);
    setSimulatedReading(undefined);
    setSimulatedWalk((state) => ({ ...state, active: true, paused: false, permissionUnavailable: false }));
  }

  function restartSimulatedWalk() {
    setPermissionChoiceMade(true);
    setSimulatedReading(undefined);
    setSimulatedWalk({ ...initialSimulatedWalkState(), active: true });
  }

  function jumpToSimulatedStop(index: number) {
    setPermissionChoiceMade(true);
    setSimulatedReading(undefined);
    setSimulatedWalk((state) => ({
      ...state,
      active: true,
      paused: true,
      currentIndex: index,
      targetIndex: Math.min(index + 1, simulatedWalkStops.length - 1),
      progressOnSegment: 0,
      permissionUnavailable: false
    }));
  }

  function setSimulatedMode(mode: SimulatedWalkMode) {
    setSimulatedWalk((state) => ({ ...state, mode }));
  }

  function openMap() {
    setActiveTab("map");
    window.requestAnimationFrame(() => {
      document.getElementById("tour-map")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  if (session.tourCompleted) {
    return (
      <main className="mx-auto max-w-4xl px-5 py-12">
        <p className="text-sm font-black uppercase text-teal-700">{tour.destinationName}</p>
        <h1 className="mt-3 text-4xl font-black text-slate-950">You Completed the {tour.title}</h1>
        <p className="mt-4 text-lg leading-8 text-slate-700">
          You finished with {completedCount} of {tour.stopCount} stops completed across an approximately {tour.durationMinutes}-minute experience.
        </p>
        <p className="mt-3 rounded-lg bg-teal-50 p-4 text-sm font-bold text-teal-900">
          This completion is saved on this device and will sync to pilot analytics when the
          production API is connected.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button className="rounded-md bg-teal-700 px-5 py-3 text-sm font-black text-white" onClick={restartTour}>
            Start Over
          </button>
          <Link className="rounded-md bg-teal-700 px-5 py-3 text-sm font-black text-white" href={`/space-coast/${tour.destinationSlug}`}>
            Return to Destination
          </Link>
          <Link className="rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-900" href="/tours">
            Browse Another Experience
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#f7fbfb] pb-28 md:pb-0">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-4 px-5 py-5 sm:py-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-sm font-black uppercase text-teal-700">{tour.destinationName}</p>
            <h1 className="mt-2 text-2xl font-black leading-tight text-slate-950 sm:text-3xl">{tour.title}</h1>
            {currentStop ? (
              <div className="mt-4 flex items-center gap-3">
                <span className="grid size-14 shrink-0 place-items-center rounded-full bg-teal-700 text-xl font-black text-white">
                  {currentStop.sequence}
                </span>
                <div>
                  <p className="text-sm font-black text-slate-950">
                    Stop {currentStop.sequence} of {tour.stopCount}
                  </p>
                  <p className="text-sm font-bold text-slate-700">{currentStop.title}</p>
                </div>
              </div>
            ) : null}
          </div>
          <div className="grid gap-2 text-sm font-bold text-slate-700">
            <p>
              {completedCount} of {tour.stopCount} stops complete
            </p>
            <p>{percent}% complete</p>
            <p>
              <span className="text-teal-800">{traveledDistance}</span> traveled
            </p>
            <p>
              <span className="text-teal-800">{elapsedTourTime}</span> elapsed
            </p>
            {nextStop ? (
              <p>
                <span className="text-teal-800">{nextLegDistanceLabel}</span> to next stop
              </p>
            ) : null}
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200 md:col-span-2">
            <div className="h-full rounded-full bg-teal-700" style={{ width: `${percent}%` }} />
          </div>
        </div>
      </section>

      {showResume ? (
        <div className="mx-auto max-w-6xl px-5 pt-5">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="font-black text-slate-950">Resume your {tour.title}?</p>
            <p className="mt-1 text-sm text-slate-700">Your completed stops and current progress are saved on this device.</p>
            <button className="mt-3 rounded-md bg-teal-700 px-4 py-2 text-sm font-black text-white hover:bg-teal-800" onClick={() => setShowResume(false)}>
              Resume Tour
            </button>
          </div>
        </div>
      ) : null}

      {currentStopArrived ? (
        <div className="mx-auto max-w-6xl px-5 pt-5">
          <p className="rounded-lg border border-teal-200 bg-teal-50 p-4 text-sm font-black text-teal-900">
            You have arrived.
          </p>
        </div>
      ) : null}

      {tour.startPoint && session.completedStopSlugs.length === 0 ? (
        <section className="mx-auto max-w-6xl px-5 pt-6">
          <div className="grid gap-4 rounded-lg border border-teal-100 bg-white p-5 shadow-sm lg:grid-cols-[0.8fr_1fr]">
            <div>
              <p className="text-sm font-black uppercase text-teal-800">Start point</p>
              <h2 className="mt-2 text-2xl font-black text-slate-950">{tour.startPoint.title}</h2>
              <p className="mt-1 font-bold text-slate-800">{tour.startPoint.address}</p>
              <p className="mt-3 text-sm leading-6 text-slate-700">{tour.startPoint.landmark}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-teal-50 p-4">
                <p className="text-sm font-black uppercase text-teal-900">Arrival</p>
                <ul className="mt-2 grid gap-2 text-sm leading-6 text-slate-700">
                  {tour.startPoint.arrivalTips.map((tip) => (
                    <li key={tip}>{tip}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg bg-amber-50 p-4">
                <p className="text-sm font-black uppercase text-amber-950">Parking</p>
                <ul className="mt-2 grid gap-2 text-sm leading-6 text-slate-700">
                  {tour.startPoint.parkingNotes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {!permissionChoiceMade && session.completedStopSlugs.length === 0 ? (
        <section className="mx-auto max-w-6xl px-5 pt-6">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">Enable Location Guidance</h2>
            <p className="mt-3 max-w-2xl leading-7 text-slate-700">
              Allow location access while this tour is open to see where you are and automatically detect when you reach each stop.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button className="min-h-12 rounded-md bg-teal-700 px-5 py-3 text-sm font-black text-white" onClick={enableLocation}>
                Enable Location
              </button>
              <button className="min-h-12 rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-900" onClick={continueWithoutLocation}>
                Continue Without Location
              </button>
            </div>
          </div>
        </section>
      ) : null}

      {canUseDevLocationSimulator() ? (
        <section className="mx-auto max-w-6xl px-5 pt-5">
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-black uppercase text-slate-700">Development GPS Walking Simulator</h2>
                <p className="mt-1 text-sm font-semibold text-amber-800">
                  Uses current repo coordinates only. Straight-line simulated GPS, not pedestrian routing.
                </p>
              </div>
              <p className="rounded-md bg-slate-100 px-3 py-2 text-xs font-black text-slate-700">
                {simulatedWalkStops.length} mapped stops
              </p>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-md bg-slate-50 p-3">
                <p className="text-xs font-black uppercase text-slate-500">Current</p>
                <p className="mt-1 text-sm font-black text-slate-950">
                  {simulatedWalkStops[simulatedWalk.currentIndex]?.title ?? "n/a"}
                </p>
              </div>
              <div className="rounded-md bg-slate-50 p-3">
                <p className="text-xs font-black uppercase text-slate-500">Target</p>
                <p className="mt-1 text-sm font-black text-slate-950">
                  {simulatedWalkStops[simulatedWalk.targetIndex]?.title ?? "n/a"}
                </p>
              </div>
              <div className="rounded-md bg-slate-50 p-3">
                <p className="text-xs font-black uppercase text-slate-500">Reading</p>
                <p className="mt-1 text-xs font-bold text-slate-800">
                  {activeReading
                    ? `${activeReading.latitude.toFixed(6)}, ${activeReading.longitude.toFixed(6)}`
                    : "unavailable"}
                </p>
              </div>
              <div className="rounded-md bg-slate-50 p-3">
                <p className="text-xs font-black uppercase text-slate-500">Distance</p>
                <p className="mt-1 text-sm font-black text-slate-950">
                  {simulatedTargetDistance === undefined ? "n/a" : formatDistance(simulatedTargetDistance)}
                </p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button className="rounded-md bg-teal-700 px-3 py-2 text-xs font-black text-white" onClick={startSimulatedWalk}>
                Start simulation
              </button>
              <button className="rounded-md border border-slate-300 px-3 py-2 text-xs font-bold text-slate-800" onClick={() => setSimulatedWalk((state) => ({ ...state, paused: true }))}>
                Pause
              </button>
              <button className="rounded-md border border-slate-300 px-3 py-2 text-xs font-bold text-slate-800" onClick={() => setSimulatedWalk((state) => ({ ...state, active: true, paused: false, permissionUnavailable: false }))}>
                Resume
              </button>
              <button className="rounded-md border border-slate-300 px-3 py-2 text-xs font-bold text-slate-800" onClick={() => setSimulatedWalk((state) => ({ ...state, active: false, paused: false }))}>
                Stop
              </button>
              <button className="rounded-md border border-slate-300 px-3 py-2 text-xs font-bold text-slate-800" onClick={restartSimulatedWalk}>
                Restart
              </button>
              <button className="rounded-md border border-slate-300 px-3 py-2 text-xs font-bold text-slate-800" onClick={() => setSimulatedWalk((state) => advanceSimulatedWalk(simulatedWalkStops, state, 60))}>
                Walk to next stop
              </button>
              <button className="rounded-md border border-slate-300 px-3 py-2 text-xs font-bold text-slate-800" onClick={() => jumpToSimulatedStop(Math.max(simulatedWalk.currentIndex - 1, 0))}>
                Previous stop
              </button>
              <button
                className="rounded-md border border-slate-300 px-3 py-2 text-xs font-bold text-slate-800"
                onClick={() => setSimulatedWalk((state) => ({ ...state, permissionUnavailable: !state.permissionUnavailable, active: false, paused: false }))}
              >
                Permission unavailable
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {(Object.keys(simulatedWalkModes) as SimulatedWalkMode[]).map((mode) => (
                <button
                  className={`rounded-md border px-3 py-2 text-xs font-bold ${
                    simulatedWalk.mode === mode ? "border-teal-700 bg-teal-700 text-white" : "border-slate-300 text-slate-800"
                  }`}
                  key={mode}
                  onClick={() => setSimulatedMode(mode)}
                >
                  {simulatedWalkModes[mode].label}
                </button>
              ))}
              {[12, 35, 80, 120].map((accuracy) => (
                <button
                  className={`rounded-md border px-3 py-2 text-xs font-bold ${
                    simulatedWalk.accuracy === accuracy ? "border-teal-700 bg-teal-700 text-white" : "border-slate-300 text-slate-800"
                  }`}
                  key={accuracy}
                  onClick={() => setSimulatedWalk((state) => ({ ...state, accuracy }))}
                >
                  {accuracy}m accuracy
                </button>
              ))}
              {[0, 8, 20, 45].map((driftMeters) => (
                <button
                  className={`rounded-md border px-3 py-2 text-xs font-bold ${
                    simulatedWalk.driftMeters === driftMeters ? "border-teal-700 bg-teal-700 text-white" : "border-slate-300 text-slate-800"
                  }`}
                  key={driftMeters}
                  onClick={() => setSimulatedWalk((state) => ({ ...state, driftMeters }))}
                >
                  {driftMeters}m drift
                </button>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {simulatedWalkStops.map((stop, index) => (
                <button
                  className="rounded-md border border-slate-300 px-3 py-2 text-xs font-bold text-slate-800"
                  key={stop.slug}
                  onClick={() => jumpToSimulatedStop(index)}
                >
                  Jump {stop.sequence}
                </button>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-200 pt-3">
              {(["far", "approach", "arrive", "jitter", "exit", "poor-accuracy"] as const).map((scenario) => (
                <button className="rounded-md border border-slate-300 px-3 py-2 text-xs font-bold text-slate-800" key={scenario} onClick={() => simulate(scenario)}>
                  {scenario}
                </button>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="mx-auto grid max-w-6xl gap-6 px-5 py-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <div className="mb-3 grid grid-cols-3 rounded-lg border border-slate-200 bg-white p-1 text-sm font-black lg:hidden">
            {(["map", "stops", "info"] as const).map((tab) => (
              <button className={`rounded-md px-3 py-2 capitalize ${activeTab === tab ? "bg-teal-700 text-white" : "text-slate-700"}`} key={tab} onClick={() => setActiveTab(tab)}>
                {tab}
              </button>
            ))}
          </div>

          <div className={activeTab === "map" ? "block" : "hidden lg:block"}>
            {mapReady ? <div className="h-[440px] scroll-mt-4 overflow-hidden rounded-lg border border-slate-200 bg-slate-100" id="tour-map" ref={mapRef} /> : null}
            {mapError || !tour.routeGeometry ? (
              <div className="rounded-lg border border-slate-200 bg-white p-6">
                <h2 className="text-2xl font-black text-slate-950">Map Unavailable</h2>
                <p className="mt-3 text-slate-700">{mapError ?? "This tour can still be completed with the ordered stop list."}</p>
              </div>
            ) : null}
            <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase text-teal-700">Map locations</p>
                  <h2 className="mt-1 text-xl font-black text-slate-950">Every Stop on This Route</h2>
                </div>
                <p className="text-sm font-bold text-slate-600">{mappableStops.length} mapped locations</p>
              </div>
              {selectedMapStop ? (
                <div className="mt-4 rounded-lg border border-teal-200 bg-teal-50 p-4">
                  <p className="text-xs font-black uppercase text-teal-800">Map Selection</p>
                  {selectedMapStopImage ? (
                    <Image
                      alt={selectedMapStopImage.imageAlt}
                      className="mt-3 aspect-[16/9] w-full rounded-md object-cover sm:max-h-56"
                      height={360}
                      src={selectedMapStopImage.imageUrl}
                      width={640}
                    />
                  ) : null}
                  <div className="mt-3 flex items-start gap-3">
                    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-teal-700 text-base font-black text-white">
                      {selectedMapStop.sequence}
                    </span>
                    <div>
                      <p className="text-sm font-black text-slate-600">Stop {selectedMapStop.sequence} of {tour.stopCount}</p>
                      <h3 className="mt-1 text-lg font-black text-slate-950">{selectedMapStop.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-700">{selectedMapStop.summary}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedMapStop.location ? (
                      <button
                        className="min-h-11 rounded-md border border-teal-300 bg-white px-4 text-sm font-black text-teal-900"
                        onClick={() => selectMapStop(selectedMapStop)}
                        type="button"
                      >
                        Show on Map
                      </button>
                    ) : (
                      <p className="rounded-md bg-white px-3 py-2 text-xs font-bold text-slate-700">
                        Map pin pending field verification.
                      </p>
                    )}
                    <Link className="inline-flex min-h-11 items-center rounded-md bg-teal-700 px-4 text-sm font-black text-white hover:bg-teal-800" href={`/tours/${tour.slug}/stops/${selectedMapStop.slug}`}>
                      Read More
                    </Link>
                    <a
                      className="inline-flex min-h-11 items-center rounded-md border border-teal-300 bg-white px-4 text-sm font-black text-teal-900"
                      href={googleMapsDirectionsUrl(selectedMapStop.location ?? selectedMapStop.title)}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Directions
                    </a>
                  </div>
                </div>
              ) : null}
              <ol className="mt-4 grid gap-2 sm:grid-cols-2">
                {tour.stops.map((stop) => {
                  const completed = session.completedStopSlugs.includes(stop.slug);
                  const current = currentStop?.slug === stop.slug;
                  const selected = selectedMapStop?.slug === stop.slug;
                  return (
                    <li
                      className={`flex items-start gap-3 rounded-md border p-3 ${
                        selected ? "border-orange-300 bg-orange-50" : current ? "border-teal-300 bg-teal-50" : completed ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-white"
                      }`}
                      key={stop.slug}
                    >
                      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-teal-700 text-xs font-black text-white">
                        {stop.sequence}
                      </span>
                      <span>
                        <span className="block text-sm font-black text-slate-950">{stop.title}</span>
                        <span className="mt-1 block text-xs font-bold text-slate-600">
                          {selected ? "Selected on map" : current ? "Current stop" : completed ? "Completed" : stop.location ? "Mapped route stop" : "Needs field coordinates"}
                        </span>
                      </span>
                      <button
                        className="ml-auto min-h-11 rounded-md border border-slate-300 bg-white px-3 text-xs font-black text-slate-800"
                        onClick={() => selectMapStop(stop)}
                        type="button"
                      >
                        Info
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          <div className={activeTab === "stops" ? "mt-4 block" : "mt-4 hidden lg:block"} id="tour-stops">
            <h2 className="text-2xl font-black text-slate-950">Stops</h2>
            <ol className="mt-4 grid gap-3">
              {tour.stops.map((stop) => {
                const completed = session.completedStopSlugs.includes(stop.slug);
                const arrived = session.arrivedStopSlugs.includes(stop.slug);
                return (
                  <li className="rounded-lg border border-slate-200 bg-white p-4" key={stop.slug}>
                    <div className="flex items-start gap-3">
                      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-teal-700 text-base font-black text-white">
                        {stop.sequence}
                      </span>
                      <div>
                        <p className="text-sm font-black text-teal-700">Stop {stop.sequence} of {tour.stopCount}</p>
                        <h3 className="mt-1 font-black text-slate-950">{stop.title}</h3>
                        <p className="mt-1 text-sm text-slate-700">{completed ? "Stop completed." : arrived ? `You've arrived at Stop ${stop.sequence}.` : stop.summary}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Link className="inline-flex min-h-11 items-center rounded-md border border-slate-300 px-4 text-sm font-bold text-slate-800" href={`/tours/${tour.slug}/stops/${stop.slug}`}>
                        Open Stop
                      </Link>
                      {!completed ? (
                        <button className="min-h-11 rounded-md bg-teal-700 px-4 text-sm font-bold text-white" onClick={() => markCurrentStopCompleted(stop.slug)}>
                          Mark Completed
                        </button>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        <aside className={activeTab === "info" ? "grid gap-4" : "hidden gap-4 lg:grid"}>
          {currentStop ? (
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-black uppercase text-orange-700">Current Stop</p>
              <div className="mt-2 flex items-start gap-3">
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-teal-700 text-lg font-black text-white">
                  {currentStop.sequence}
                </span>
                <div>
                  <p className="text-sm font-black text-slate-600">Stop {currentStop.sequence} of {tour.stopCount}</p>
                  <h2 className="mt-1 text-2xl font-black text-slate-950">{currentStop.title}</h2>
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-700">{currentStop.summary}</p>
              {nextStop ? (
                <p className="mt-3 rounded-md bg-cyan-50 p-3 text-sm font-bold text-cyan-950">
                  Next Stop: {nextStop.title}
                </p>
              ) : null}
              {currentDistance ? <p className="mt-3 text-sm font-black text-teal-800">{currentDistance} to Stop {currentStop.sequence}</p> : null}
              {currentStopArrived ? <p className="mt-3 rounded-md bg-teal-50 p-3 text-sm font-black text-teal-900">You have arrived.</p> : null}
              {accuracyWeak ? <p className="mt-3 rounded-md bg-amber-50 p-3 text-sm font-bold text-amber-900">Your location signal is currently too weak for automatic stop detection. You can continue manually.</p> : null}
              {location.status === "denied" ? <p className="mt-3 rounded-md bg-slate-100 p-3 text-sm font-bold text-slate-700">Location access was denied. You can continue manually.</p> : null}
              <div className="mt-5 flex flex-wrap gap-3">
                <Link className="inline-flex min-h-11 items-center rounded-md bg-teal-700 px-4 text-sm font-black text-white hover:bg-teal-800" href={`/tours/${tour.slug}/stops/${currentStop.slug}`}>
                  Open Stop
                </Link>
                <a
                  className="inline-flex min-h-11 items-center rounded-md border border-slate-300 bg-white px-4 text-sm font-black text-slate-900"
                  href={currentDirectionsUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  Directions
                </a>
                <button className="min-h-11 rounded-md bg-teal-700 px-4 text-sm font-black text-white" onClick={() => markCurrentStopCompleted(currentStop.slug)}>
                  Mark Completed
                </button>
                <button className="min-h-11 rounded-md border border-teal-300 bg-white px-4 text-sm font-black text-teal-900" onClick={finishTourNow}>
                  Finish Tour
                </button>
              </div>
            </div>
          ) : null}
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-xl font-black text-slate-950">Safety & Accessibility</h2>
            <p className="mt-3 text-sm leading-6 text-slate-700">{tour.accessibilitySummary}</p>
            <ul className="mt-3 grid gap-2 text-sm text-slate-700">
              {tour.safetyNotes.map((note) => <li key={note}>{note}</li>)}
            </ul>
          </div>
          <PremiumUpgradeCard tour={tour} />
        </aside>
      </section>
      {currentStop ? (
        <>
        <EngagementUpgradePrompt completedCount={completedCount} tour={tour} />
        <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-12px_34px_rgba(15,23,42,0.16)] backdrop-blur md:hidden">
          <div className="mx-auto grid max-w-lg gap-3">
            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
              <span className="grid size-11 place-items-center rounded-full bg-teal-700 text-base font-black text-white">
                {currentStop.sequence}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-black uppercase text-teal-800">
                  Stop {currentStop.sequence} of {tour.stopCount}
                </p>
                <p className="truncate text-sm font-black text-slate-950">{currentStop.title}</p>
              </div>
              {nextStop ? (
                <Link
                  className="inline-flex min-h-11 items-center justify-center rounded-md bg-teal-700 px-4 text-sm font-black text-white"
                  href={`/tours/${tour.slug}/stops/${nextStop.slug}`}
                >
                  Next Stop
                </Link>
              ) : (
                <button className="min-h-11 rounded-md bg-teal-700 px-4 text-sm font-black text-white" onClick={() => markCurrentStopCompleted(currentStop.slug)}>
                  Finish
                </button>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {previousStop ? (
                <Link
                  className="inline-flex min-h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-sm font-black text-slate-900"
                  href={`/tours/${tour.slug}/stops/${previousStop.slug}`}
                >
                  Back
                </Link>
              ) : (
                <Link
                  className="inline-flex min-h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-sm font-black text-slate-900"
                  href={`/space-coast/${tour.destinationSlug}`}
                >
                  Back
                </Link>
              )}
              <button
                className="min-h-11 rounded-md border border-slate-300 bg-white px-3 text-sm font-black text-slate-900"
                onClick={openMap}
              >
                Open Map
              </button>
              <a
                className="inline-flex min-h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-sm font-black text-slate-900"
                href={currentDirectionsUrl}
                rel="noreferrer"
                target="_blank"
              >
                Directions
              </a>
            </div>
            <button className="min-h-11 rounded-md border border-teal-300 bg-white px-3 text-sm font-black text-teal-900" onClick={finishTourNow}>
              Finish Tour
            </button>
          </div>
        </nav>
        </>
      ) : null}
    </main>
  );
}
