"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  type Launch,
  type ViewingSpot,
  countdownState,
  formatLaunchDate,
  launchMissionName,
  launchStatusClass,
  launchStatusLabel,
  launchVehicleName
} from "../../lib/launches";

export function LaunchCountdown({ launchAt, compact = false }: { launchAt: string | null; compact?: boolean }) {
  const [now, setNow] = useState(() => Date.now());
  const state = useMemo(() => countdownState(launchAt, now), [launchAt, now]);

  useEffect(() => {
    if (!launchAt) {
      return;
    }

    const prefersReducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const intervalMs = prefersReducedMotion ? 30_000 : 1_000;
    const intervalId = window.setInterval(() => setNow(Date.now()), intervalMs);

    return () => window.clearInterval(intervalId);
  }, [launchAt]);

  return (
    <div>
      <p className="sr-only" aria-live="off">
        {state.accessibleLabel}
      </p>
      <p
        aria-hidden="true"
        className={`font-mono font-black tabular-nums tracking-normal text-[#FF6B00] ${
          compact ? "text-xl" : "text-5xl sm:text-7xl"
        }`}
      >
        {state.label}
      </p>
    </div>
  );
}

export function LaunchStatusBadge({ status }: { status: Launch["status"] }) {
  return (
    <span
      className={`inline-flex min-h-9 items-center rounded-md border px-3 text-sm font-black ${launchStatusClass(status)}`}
    >
      {launchStatusLabel(status)}
    </span>
  );
}

export function StickyLaunchHeader({ launch }: { launch: Launch }) {
  return (
    <a
      className="sticky top-[73px] z-10 grid min-h-14 grid-cols-[1fr_auto_auto] items-center gap-3 border-b border-cyan-300/20 bg-slate-950/95 px-4 text-slate-50 shadow-[0_12px_35px_rgba(0,0,0,0.32)] backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-cyan-300 sm:top-[65px] sm:px-5"
      href="#active-launch"
      aria-label={`Active launch ${launchVehicleName(launch)} ${countdownState(launch.net).accessibleLabel}`}
    >
      <span className="min-w-0">
        <span className="block truncate text-xs font-black uppercase text-cyan-200">Active launch</span>
        <span className="block truncate text-sm font-black">{launchVehicleName(launch)}</span>
      </span>
      <LaunchCountdown launchAt={launch.net} compact />
      <span className="rounded-md border border-cyan-300/40 px-2 py-1 text-xs font-black text-cyan-100">
        {launchStatusLabel(launch.status)}
      </span>
    </a>
  );
}

export function LaunchHeroCard({ launch }: { launch: Launch }) {
  const vehicle = launchVehicleName(launch);
  const mission = launchMissionName(launch);
  const pad = launch.pad?.name ?? "Pad pending";
  const provider = launch.launch_provider.abbreviation ?? launch.launch_provider.name ?? "Provider pending";

  return (
    <section
      className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900/80 shadow-2xl shadow-cyan-950/30 backdrop-blur-md"
      id="active-launch"
    >
      <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_0.78fr] lg:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <p className="rounded-md border border-cyan-300/40 bg-cyan-300/10 px-3 py-1 text-xs font-black uppercase text-cyan-100">
              Launch Mode
            </p>
            <LaunchStatusBadge status={launch.status} />
            {launch.provider_source === "development_fixture" ? (
              <p className="rounded-md border border-orange-300/40 bg-orange-400/10 px-3 py-1 text-xs font-black uppercase text-orange-100">
                Development fixture
              </p>
            ) : null}
          </div>
          <h1 className="mt-5 text-4xl font-black leading-none text-slate-50 sm:text-6xl">{vehicle}</h1>
          <p className="mt-3 text-2xl font-black text-cyan-100 sm:text-3xl">{mission}</p>
          <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-3">
            {[
              ["Pad", pad],
              ["Provider", provider],
              ["Launch time", formatLaunchDate(launch.net)]
            ].map(([label, value]) => (
              <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4" key={label}>
                <dt className="text-xs font-black uppercase text-slate-300">{label}</dt>
                <dd className="mt-1 font-black text-slate-50">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              className="inline-flex min-h-12 items-center justify-center rounded-md bg-cyan-300 px-5 text-sm font-black text-slate-950 hover:bg-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-100"
              href="#mission-details"
            >
              View Mission
            </a>
            <a
              className="inline-flex min-h-12 items-center justify-center rounded-md border border-cyan-300/60 px-5 text-sm font-black text-cyan-100 hover:bg-cyan-300/10 focus:outline-none focus:ring-2 focus:ring-cyan-100"
              href="#viewing-spots"
            >
              Find Viewing Spots
            </a>
          </div>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-5">
          <p className="text-sm font-black uppercase text-slate-300">T-minus</p>
          <div className="mt-3">
            <LaunchCountdown launchAt={launch.net} />
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-300">
            Countdown is based on the launch timestamp supplied by the normalized Space Coast
            Explorer launch API. Confirm official updates before travel.
          </p>
        </div>
      </div>
    </section>
  );
}

export function ViewingSpotStatus({ spot }: { spot: ViewingSpot }) {
  const label = spot.quality === "excellent" ? "Excellent view" : spot.quality === "good" ? "Good view" : "Limited view";
  return (
    <span className="inline-flex rounded-md border border-cyan-300/40 bg-cyan-300/10 px-3 py-1 text-xs font-black uppercase text-cyan-100">
      {label}
    </span>
  );
}

export function ViewingSpotCard({
  spot,
  selected,
  onSelect
}: {
  spot: ViewingSpot;
  selected: boolean;
  onSelect: (spot: ViewingSpot) => void;
}) {
  return (
    <button
      aria-pressed={selected}
      className={`w-full rounded-lg border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-cyan-200 ${
        selected
          ? "border-cyan-300 bg-cyan-300/10"
          : "border-slate-800 bg-slate-900/80 hover:border-cyan-300/60"
      }`}
      onClick={() => onSelect(spot)}
      type="button"
    >
      {spot.imageUrl ? (
        <Image
          alt={spot.imageAlt ?? spot.name}
          className="aspect-[16/9] w-full rounded-md object-cover"
          height={360}
          src={spot.imageUrl}
          width={640}
        />
      ) : null}
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-black text-slate-50">{spot.name}</h3>
          <p className="mt-1 text-sm font-semibold text-slate-300">
            {spot.distanceFromPadMiles ? `${spot.distanceFromPadMiles} mi from launch pad` : "Distance pending"}
          </p>
        </div>
        <ViewingSpotStatus spot={spot} />
      </div>
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-300">
        {spot.lineOfSightNotes ?? "Viewing notes are under review."}
      </p>
    </button>
  );
}

export function ViewingSpotDrawer({
  spot,
  onClose
}: {
  spot: ViewingSpot | undefined;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!spot) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, spot]);

  if (!spot) {
    return null;
  }

  return (
    <div
      aria-label={`${spot.name} viewing spot details`}
      aria-modal="false"
      className="fixed inset-x-0 bottom-0 z-30 rounded-t-2xl border border-slate-700 bg-slate-950 p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] text-slate-50 shadow-2xl shadow-black/60 md:left-auto md:right-6 md:top-28 md:bottom-auto md:w-[390px] md:rounded-lg"
      role="dialog"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase text-cyan-200">Selected viewing spot</p>
          <h3 className="mt-1 text-2xl font-black">{spot.name}</h3>
        </div>
        <button
          className="grid min-h-11 min-w-11 place-items-center rounded-md border border-slate-700 text-xl font-black text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-200"
          onClick={onClose}
          type="button"
          aria-label="Close viewing spot details"
        >
          ×
        </button>
      </div>
      <dl className="mt-4 grid gap-3 text-sm">
        <div>
          <dt className="font-black text-slate-50">Line of sight</dt>
          <dd className="mt-1 text-slate-300">{spot.lineOfSightNotes ?? "Under review."}</dd>
        </div>
        <div>
          <dt className="font-black text-slate-50">Parking</dt>
          <dd className="mt-1 text-slate-300">{spot.parking ?? "Parking details pending."}</dd>
        </div>
        <div>
          <dt className="font-black text-slate-50">Accessibility</dt>
          <dd className="mt-1 text-slate-300">{spot.accessibility ?? "Accessibility details pending."}</dd>
        </div>
        {spot.expectedCrowdLevel ? (
          <div>
            <dt className="font-black text-slate-50">Expected crowd level</dt>
            <dd className="mt-1 text-slate-300">{spot.expectedCrowdLevel}</dd>
          </div>
        ) : null}
      </dl>
      <a
        className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-md bg-cyan-300 px-5 text-sm font-black text-slate-950 focus:outline-none focus:ring-2 focus:ring-cyan-100"
        href={spot.directionsUrl}
      >
        Get Directions
      </a>
    </div>
  );
}

function markerPosition(index: number, total: number) {
  const positions = [
    { left: "23%", top: "62%" },
    { left: "46%", top: "48%" },
    { left: "68%", top: "66%" },
    { left: "78%", top: "36%" }
  ];
  return positions[index] ?? { left: `${20 + (index / Math.max(total, 1)) * 65}%`, top: "54%" };
}

export function LaunchViewingMap({
  launch,
  spots,
  selectedSpot,
  onSelectSpot
}: {
  launch: Launch;
  spots: ViewingSpot[];
  selectedSpot: ViewingSpot | undefined;
  onSelectSpot: (spot: ViewingSpot) => void;
}) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-4 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black uppercase text-cyan-200">Viewing map preview</p>
          <p className="mt-1 text-sm text-slate-300">Development map preview until launch map tiles are connected.</p>
        </div>
        <span className="rounded-md border border-slate-700 px-3 py-1 text-xs font-black text-slate-200">
          {launch.pad?.name ?? "Pad pending"}
        </span>
      </div>
      <div className="relative mt-4 h-[360px] overflow-hidden rounded-lg border border-slate-800 bg-[radial-gradient(circle_at_72%_28%,rgba(0,240,255,0.22),transparent_18%),linear-gradient(135deg,#020617,#0f172a_48%,#062f36)]">
        <div className="absolute inset-y-0 right-[18%] w-[22%] bg-cyan-300/10 blur-2xl" aria-hidden="true" />
        <div className="absolute left-[72%] top-[24%] -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="grid size-14 place-items-center rounded-full border-2 border-cyan-200 bg-cyan-300 text-xl font-black text-slate-950 shadow-[0_0_35px_rgba(0,240,255,0.55)]">
            ▲
          </div>
          <p className="mt-2 rounded-md bg-slate-950/80 px-2 py-1 text-xs font-black text-cyan-100">
            Launch pad
          </p>
        </div>
        {spots.map((spot, index) => {
          const selected = selectedSpot?.id === spot.id;
          const position = markerPosition(index, spots.length);
          return (
            <button
              aria-label={`Select viewing spot ${spot.name}`}
              aria-pressed={selected}
              className={`absolute grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 text-sm font-black shadow-lg focus:outline-none focus:ring-4 focus:ring-cyan-200 ${
                selected
                  ? "size-14 border-orange-300 bg-[#FF6B00] text-white"
                  : "size-11 border-white bg-slate-50 text-slate-950"
              }`}
              key={spot.id}
              onClick={() => onSelectSpot(spot)}
              style={position}
              type="button"
            >
              {index + 1}
            </button>
          );
        })}
        <div className="absolute bottom-4 left-4 rounded-md border border-slate-700 bg-slate-950/85 px-3 py-2 text-xs font-semibold text-slate-200">
          GPS marker and recenter control planned for live map integration.
        </div>
      </div>
    </div>
  );
}

export function LaunchMissionPanel({ launch }: { launch: Launch }) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md" id="mission-details">
      <p className="text-sm font-black uppercase text-cyan-200">Mission details</p>
      <h2 className="mt-2 text-3xl font-black text-slate-50">{launchMissionName(launch)}</h2>
      <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
        {launch.mission?.description ??
          "Mission details are pending from the normalized launch provider feed."}
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Link className="rounded-md border border-slate-700 px-4 py-3 text-center text-sm font-black text-slate-50 hover:border-cyan-300" href="/space-coast">
          Space Coast Guide
        </Link>
        <Link className="rounded-md border border-slate-700 px-4 py-3 text-center text-sm font-black text-slate-50 hover:border-cyan-300" href="/tours">
          Nearby Tours
        </Link>
        <a className="rounded-md border border-slate-700 px-4 py-3 text-center text-sm font-black text-slate-50 hover:border-cyan-300" href="#viewing-spots">
          Viewing Spots
        </a>
      </div>
    </section>
  );
}
