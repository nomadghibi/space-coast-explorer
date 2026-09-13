"use client";

import "maplibre-gl/dist/maplibre-gl.css";

import {
  createTourSession,
  defaultProximityOptions,
  evaluateStopProximity,
  formatDistance,
  progressPercent,
  type LocationReading,
  type ProximityStop,
  type StopProximityState,
  type TourSessionState
} from "@space-coast-explorer/maps";
import type { TourDetail } from "@space-coast-explorer/types";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { canUseDevLocationSimulator, simulatedReadingForScenario, type SimulatedLocationScenario } from "../lib/dev-location-simulator";
import { arriveAtStop, completeStop, loadTourSession, setLocationEnabled, startTourSession } from "../lib/tour-session";
import { useForegroundLocation } from "../lib/use-foreground-location";
import { recordVisitorAnalyticsEvent } from "../lib/visitor-analytics";

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

export function ActiveTour({ tour }: { tour: TourDetail }) {
  const orderedStopSlugs = useMemo(() => tour.stops.map((stop) => stop.slug), [tour.stops]);
  const firstStopSlug = orderedStopSlugs[0] ?? "";
  const [session, setSession] = useState<TourSessionState>(() =>
    createTourSession(tour.slug, firstStopSlug, new Date("2026-09-12T00:00:00.000Z"))
  );
  const [showResume, setShowResume] = useState(false);
  const [simulatedReading, setSimulatedReading] = useState<LocationReading | undefined>();
  const [permissionChoiceMade, setPermissionChoiceMade] = useState(false);
  const [mapError, setMapError] = useState<string | undefined>();
  const [activeTab, setActiveTab] = useState<"map" | "stops" | "info">("map");
  const [stopStates, setStopStates] = useState<Record<string, StopProximityState>>({});
  const location = useForegroundLocation();
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<import("maplibre-gl").Map | undefined>(undefined);
  const userMarkerRef = useRef<import("maplibre-gl").Marker | undefined>(undefined);
  const startTrackedRef = useRef(false);
  const completionTrackedRef = useRef(false);
  const styleUrl = process.env.NEXT_PUBLIC_MAP_STYLE_URL ?? defaultMapStyleUrl;
  const mappableStops = useMemo(() => tour.stops.map(stopToProximity).filter((stop): stop is ProximityStop => Boolean(stop)), [tour.stops]);
  const currentStop = tour.stops.find((stop) => stop.slug === session.currentStopSlug) ?? tour.stops[0];
  const activeReading = simulatedReading ?? location.reading;
  const currentDistance = currentStop?.location && activeReading ? formatDistance(evaluateStopProximity(stopToProximity(currentStop)!, activeReading).distanceMeters) : undefined;
  const completedCount = session.completedStopSlugs.length;
  const percent = progressPercent(completedCount, tour.stopCount);
  const accuracyWeak = activeReading ? activeReading.accuracy > defaultProximityOptions.maximumUsefulAccuracyMeters : false;
  const mapReady = Boolean(tour.routeGeometry && mappableStops.length && !mapError);
  const currentStopArrived = currentStop ? session.arrivedStopSlugs.includes(currentStop.slug) : false;

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
    if (!mapRef.current || !tour.routeGeometry || mapInstanceRef.current || !styleUrl) {
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
            const element = document.createElement("div");
            element.className = "tour-map-marker";
            element.textContent = String(stop.sequence);
            new maplibregl.Marker({ element }).setLngLat(mapCoordinates(stop.location)).addTo(map);
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
  }, [mappableStops, styleUrl, tour.routeGeometry]);

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
    if (next.tourCompleted && !completionTrackedRef.current) {
      completionTrackedRef.current = true;
      void recordVisitorAnalyticsEvent(tour, "visitor_experience.completed", {
        completionMethod: "manual",
        completedStops: next.completedStopSlugs.length,
        totalStops: tour.stopCount
      });
    }
  }

  function simulate(scenario: SimulatedLocationScenario) {
    const simulated = simulatedReadingForScenario(tour, scenario);
    if (simulated) {
      setSimulatedReading(simulated);
    }
  }

  if (session.tourCompleted) {
    return (
      <main className="mx-auto max-w-4xl px-5 py-12">
        <p className="text-sm font-black uppercase text-teal-700">{tour.destinationName}</p>
        <h1 className="mt-3 text-4xl font-black text-slate-950">You Completed the {tour.title}</h1>
        <p className="mt-4 text-lg leading-8 text-slate-700">
          You completed {tour.stopCount} stops across an approximately {tour.durationMinutes}-minute experience.
        </p>
        <p className="mt-3 rounded-lg bg-teal-50 p-4 text-sm font-bold text-teal-900">
          This completion is saved on this device and will sync to pilot analytics when the
          production API is connected.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
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
    <main className="bg-[#f7fbfb]">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-6">
          <p className="text-sm font-black uppercase text-teal-700">{tour.destinationName}</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">{tour.title}</h1>
          <p className="mt-3 text-sm font-bold text-slate-700">
            {completedCount} of {tour.stopCount} stops · {percent}% complete
          </p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-teal-700" style={{ width: `${percent}%` }} />
          </div>
        </div>
      </section>

      {showResume ? (
        <div className="mx-auto max-w-6xl px-5 pt-5">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="font-black text-slate-950">Resume your {tour.title}?</p>
            <p className="mt-1 text-sm text-slate-700">Your completed stops and current progress are saved on this device.</p>
            <button className="mt-3 rounded-md bg-slate-950 px-4 py-2 text-sm font-black text-white" onClick={() => setShowResume(false)}>
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

      {!permissionChoiceMade && session.completedStopSlugs.length === 0 ? (
        <section className="mx-auto max-w-6xl px-5 pt-6">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">Enable Location Guidance</h2>
            <p className="mt-3 max-w-2xl leading-7 text-slate-700">
              Allow location access while this tour is open to see where you are and automatically detect when you reach each stop.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button className="rounded-md bg-teal-700 px-5 py-3 text-sm font-black text-white" onClick={enableLocation}>
                Enable Location
              </button>
              <button className="rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-900" onClick={continueWithoutLocation}>
                Continue Without Location
              </button>
            </div>
          </div>
        </section>
      ) : null}

      {canUseDevLocationSimulator() ? (
        <section className="mx-auto max-w-6xl px-5 pt-5">
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-4">
            <h2 className="text-sm font-black uppercase text-slate-700">Development GPS Simulator</h2>
            <div className="mt-3 flex flex-wrap gap-2">
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
            {mapReady ? <div className="h-[440px] overflow-hidden rounded-lg border border-slate-200 bg-slate-100" ref={mapRef} /> : null}
            {mapError || !tour.routeGeometry ? (
              <div className="rounded-lg border border-slate-200 bg-white p-6">
                <h2 className="text-2xl font-black text-slate-950">Map Unavailable</h2>
                <p className="mt-3 text-slate-700">{mapError ?? "This tour can still be completed with the ordered stop list."}</p>
              </div>
            ) : null}
          </div>

          <div className={activeTab === "stops" ? "mt-4 block" : "mt-4 hidden lg:block"}>
            <h2 className="text-2xl font-black text-slate-950">Stops</h2>
            <ol className="mt-4 grid gap-3">
              {tour.stops.map((stop) => {
                const completed = session.completedStopSlugs.includes(stop.slug);
                const arrived = session.arrivedStopSlugs.includes(stop.slug);
                return (
                  <li className="rounded-lg border border-slate-200 bg-white p-4" key={stop.slug}>
                    <p className="text-sm font-black text-teal-700">Stop {stop.sequence}</p>
                    <h3 className="mt-1 font-black text-slate-950">{stop.title}</h3>
                    <p className="mt-1 text-sm text-slate-700">{completed ? "Stop completed." : arrived ? `You've arrived at Stop ${stop.sequence}.` : stop.summary}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Link className="rounded-md border border-slate-300 px-3 py-2 text-sm font-bold text-slate-800" href={`/tours/${tour.slug}/stops/${stop.slug}`}>
                        Open Stop
                      </Link>
                      {!completed ? (
                        <button className="rounded-md bg-teal-700 px-3 py-2 text-sm font-bold text-white" onClick={() => markCurrentStopCompleted(stop.slug)}>
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
              <h2 className="mt-2 text-2xl font-black text-slate-950">
                Stop {currentStop.sequence}: {currentStop.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-700">{currentStop.summary}</p>
              {currentDistance ? <p className="mt-3 text-sm font-black text-teal-800">{currentDistance} to Stop {currentStop.sequence}</p> : null}
              {currentStopArrived ? <p className="mt-3 rounded-md bg-teal-50 p-3 text-sm font-black text-teal-900">You have arrived.</p> : null}
              {accuracyWeak ? <p className="mt-3 rounded-md bg-amber-50 p-3 text-sm font-bold text-amber-900">Your location signal is currently too weak for automatic stop detection. You can continue manually.</p> : null}
              {location.status === "denied" ? <p className="mt-3 rounded-md bg-slate-100 p-3 text-sm font-bold text-slate-700">Location access was denied. You can continue manually.</p> : null}
              <div className="mt-5 flex flex-wrap gap-3">
                <Link className="rounded-md bg-slate-950 px-4 py-2 text-sm font-black text-white" href={`/tours/${tour.slug}/stops/${currentStop.slug}`}>
                  Open Stop
                </Link>
                <button className="rounded-md bg-teal-700 px-4 py-2 text-sm font-black text-white" onClick={() => markCurrentStopCompleted(currentStop.slug)}>
                  Mark Completed
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
        </aside>
      </section>
    </main>
  );
}
