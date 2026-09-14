"use client";

import type { TourDetail } from "@space-coast-explorer/types";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { getTourStopImage } from "../lib/content";

type PreviewPoint = {
  latitude: number;
  longitude: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function projectPoint(
  point: PreviewPoint,
  bounds: { minLatitude: number; maxLatitude: number; minLongitude: number; maxLongitude: number }
) {
  const longitudeRange = bounds.maxLongitude - bounds.minLongitude || 1;
  const latitudeRange = bounds.maxLatitude - bounds.minLatitude || 1;
  const x = ((point.longitude - bounds.minLongitude) / longitudeRange) * 84 + 8;
  const y = (1 - (point.latitude - bounds.minLatitude) / latitudeRange) * 76 + 12;

  return {
    x: clamp(x, 8, 92),
    y: clamp(y, 12, 88)
  };
}

export function RoutePreview({ tour }: { tour: TourDetail }) {
  const mappedStops = useMemo(() => tour.stops.filter((stop) => Boolean(stop.location)), [tour.stops]);
  const routeCoordinates = tour.routeGeometry?.coordinates ?? mappedStops.flatMap((stop) => (stop.location ? [stop.location] : []));
  const allPoints = [...routeCoordinates, ...mappedStops.flatMap((stop) => (stop.location ? [stop.location] : []))];
  const [selectedStopSlug, setSelectedStopSlug] = useState(mappedStops[0]?.slug);
  const selectedStop = useMemo(
    () => tour.stops.find((stop) => stop.slug === selectedStopSlug) ?? mappedStops[0],
    [mappedStops, selectedStopSlug, tour.stops]
  );
  const selectedStopImage = selectedStop ? getTourStopImage(tour, selectedStop) : undefined;
  const bounds = allPoints.length
    ? {
        minLatitude: Math.min(...allPoints.map((point) => point.latitude)),
        maxLatitude: Math.max(...allPoints.map((point) => point.latitude)),
        minLongitude: Math.min(...allPoints.map((point) => point.longitude)),
        maxLongitude: Math.max(...allPoints.map((point) => point.longitude))
      }
    : {
        minLatitude: 0,
        maxLatitude: 1,
        minLongitude: 0,
        maxLongitude: 1
      };
  const routeLine = routeCoordinates.map((point) => projectPoint(point, bounds)).map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <div className="route-preview overflow-hidden rounded-lg border border-white/80 shadow-[0_18px_60px_rgba(15,23,42,0.12)]">
      <div className="relative h-72">
        {routeLine ? (
          <svg aria-hidden="true" className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
            <polyline fill="none" points={routeLine} stroke="#0f766e" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.78" strokeWidth="2.7" />
          </svg>
        ) : null}
        {mappedStops.map((stop) => {
          const point = stop.location ? projectPoint(stop.location, bounds) : { x: 50, y: 50 };
          const selected = selectedStop?.slug === stop.slug;
          return (
            <button
              aria-label={`Stop ${stop.sequence}: ${stop.title}`}
              aria-pressed={selected}
              className={`absolute grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white text-sm font-black text-white shadow-lg transition ${
                selected ? "bg-orange-600 ring-4 ring-orange-200" : "bg-teal-700 hover:bg-teal-800"
              }`}
              key={stop.slug}
              onClick={() => setSelectedStopSlug(stop.slug)}
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
              title={`Stop ${stop.sequence}: ${stop.title}`}
              type="button"
            >
              {stop.sequence}
            </button>
          );
        })}
      </div>
      <div className="border-t border-slate-200 bg-white/95 p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase text-teal-700">Mapped Route Preview</p>
            <p className="mt-1 font-semibold text-slate-950">
              {mappedStops.length} {tour.destinationName} locations
            </p>
          </div>
          <p className="text-sm font-bold text-slate-600">{tour.durationMinutes} min</p>
        </div>
        <p className="mt-1 text-sm text-slate-700">{tour.staticRouteSummary}</p>
        {selectedStop ? (
          <div className="mt-4 rounded-lg border border-teal-200 bg-teal-50 p-4">
            <p className="text-xs font-black uppercase text-teal-800">Selected Stop</p>
            {selectedStopImage ? (
              <Image
                alt={selectedStopImage.imageAlt}
                className="mt-3 aspect-[16/9] w-full rounded-md object-cover"
                height={360}
                src={selectedStopImage.imageUrl}
                width={640}
              />
            ) : null}
            <div className="mt-3 flex items-start gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-teal-700 text-sm font-black text-white">
                {selectedStop.sequence}
              </span>
              <div>
                <h3 className="font-black text-slate-950">{selectedStop.title}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-700">{selectedStop.summary}</p>
              </div>
            </div>
            <Link
              className="mt-3 inline-flex min-h-11 items-center rounded-md bg-teal-700 px-4 text-sm font-black text-white hover:bg-teal-800"
              href={`/tours/${tour.slug}/stops/${selectedStop.slug}`}
            >
              Read More
            </Link>
          </div>
        ) : null}
        <ol className="mt-4 grid gap-2 sm:grid-cols-2">
          {mappedStops.map((stop) => (
            <li key={stop.slug}>
              <button
                className={`flex w-full items-center gap-2 rounded-md p-2 text-left text-sm font-bold text-slate-800 ${
                  selectedStop?.slug === stop.slug ? "bg-teal-50" : "hover:bg-slate-50"
                }`}
                onClick={() => setSelectedStopSlug(stop.slug)}
                type="button"
              >
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-teal-700 text-[11px] font-black text-white">
                {stop.sequence}
                </span>
                <span>{stop.title}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
