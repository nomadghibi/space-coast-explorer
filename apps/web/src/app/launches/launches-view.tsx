"use client";

import Link from "next/link";
import { useState } from "react";
import {
  type Launch,
  type LaunchFeedState,
  type ViewingSpot,
  developmentViewingSpots,
  formatLaunchDate,
  formatLaunchWindow,
  launchStatusClass,
  launchStatusLabel,
  launchVehicleName
} from "../../lib/launches";
import {
  LaunchHeroCard,
  LaunchMissionPanel,
  LaunchViewingMap,
  StickyLaunchHeader,
  ViewingSpotCard,
  ViewingSpotDrawer
} from "./launch-mode-components";

function FreshnessBanner({ feed }: { feed: LaunchFeedState }) {
  if (feed.status === "ready" && feed.dataFreshness === "stale") {
    const development = feed.launches.some((launch) => launch.provider_source === "development_fixture");
    return (
      <div className="rounded-lg border border-orange-300/40 bg-orange-400/10 p-4 text-sm font-semibold text-orange-100">
        {development
          ? "Development fixture data is showing because the production launch API is not connected in this web environment."
          : "Launch data is temporarily stale. Showing the last successful update while the provider is unavailable."}
      </div>
    );
  }

  if (feed.status === "unavailable") {
    return (
      <div className="rounded-lg border border-slate-700 bg-slate-900 p-4 text-sm font-semibold text-slate-200">
        Launch data is temporarily unavailable. Cocoa Village tours are still available while launch
        data is being connected.
      </div>
    );
  }

  return null;
}

function LaunchStatusPill({ status }: { status: Launch["status"] }) {
  return (
    <span className={`inline-flex rounded-md border px-3 py-1 text-xs font-black ${launchStatusClass(status)}`}>
      {launchStatusLabel(status)}
    </span>
  );
}

function LaunchListItem({ launch }: { launch: Launch }) {
  return (
    <article className="rounded-lg border border-slate-800 bg-slate-900/80 p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-black leading-snug text-slate-50">{launch.name}</h2>
          <p className="mt-2 text-sm font-semibold text-slate-300">{formatLaunchDate(launch.net)}</p>
        </div>
        <LaunchStatusPill status={launch.status} />
      </div>
      <div className="mt-4 grid gap-2 text-sm text-slate-300 sm:grid-cols-3">
        <p>
          <span className="font-black text-slate-50">Rocket:</span>{" "}
          {launch.rocket?.name ?? "Pending"}
        </p>
        <p>
          <span className="font-black text-slate-50">Pad:</span> {launch.pad?.name ?? "Pending"}
        </p>
        <p>
          <span className="font-black text-slate-50">Window:</span> {formatLaunchWindow(launch)}
        </p>
      </div>
    </article>
  );
}

function EmptyLaunches() {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-8 text-center shadow-sm">
      <h2 className="text-2xl font-black text-slate-50">No Space Coast launches available</h2>
      <p className="mt-2 text-slate-300">
        The provider did not return upcoming launches for the configured Florida pads.
      </p>
    </div>
  );
}

function ViewingSpotsSection({ launch }: { launch: Launch }) {
  const [selectedSpot, setSelectedSpot] = useState<ViewingSpot | undefined>();

  return (
    <section className="mx-auto grid max-w-6xl gap-5 px-5 py-10 lg:grid-cols-[1fr_360px]" id="viewing-spots">
      <div>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-black uppercase text-cyan-200">Where can I watch?</p>
            <h2 className="mt-1 text-3xl font-black text-slate-50">Viewing Spots</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-slate-300">
            These viewing spots are development data for UI validation. Confirm access, closures,
            traffic, and official safety guidance before travel.
          </p>
        </div>
        <div className="mt-5">
          <LaunchViewingMap
            launch={launch}
            onSelectSpot={setSelectedSpot}
            selectedSpot={selectedSpot}
            spots={developmentViewingSpots}
          />
        </div>
      </div>
      <div className="grid gap-3">
        {developmentViewingSpots.map((spot) => (
          <ViewingSpotCard
            key={spot.id}
            onSelect={setSelectedSpot}
            selected={selectedSpot?.id === spot.id}
            spot={spot}
          />
        ))}
      </div>
      <ViewingSpotDrawer onClose={() => setSelectedSpot(undefined)} spot={selectedSpot} />
    </section>
  );
}

export function LaunchesView({ feed }: { feed: LaunchFeedState }) {
  const launches = feed.status === "ready" ? feed.launches : [];
  const nextLaunch = launches[0];
  const lastUpdated =
    feed.status === "ready" && feed.lastUpdatedAt
      ? formatLaunchDate(feed.lastUpdatedAt)
      : "Not connected";

  return (
    <main className="bg-slate-950 text-slate-50">
      {nextLaunch ? <StickyLaunchHeader launch={nextLaunch} /> : null}
      <section className="mx-auto grid max-w-6xl gap-5 px-5 py-8 sm:py-12">
        <div className="grid gap-5 lg:grid-cols-[1fr_320px] lg:items-end">
          <div>
            <p className="text-sm font-black uppercase text-[#00F0FF]">Florida tourism + mission control</p>
            <h1 className="mt-2 text-4xl font-black leading-tight text-slate-50 sm:text-6xl">
              Space Coast Launches
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
              Track the next Space Coast launch, check the mission status, and find practical
              viewing options without leaving the explorer experience.
            </p>
          </div>
          <aside className="rounded-lg border border-slate-800 bg-slate-900/80 p-5 shadow-sm backdrop-blur-md">
            <p className="text-sm font-black uppercase text-cyan-200">Data status</p>
            <p className="mt-2 text-2xl font-black text-slate-50">
              {feed.status === "ready" ? feed.dataFreshness : "Unavailable"}
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-300">Last update: {lastUpdated}</p>
          </aside>
        </div>

        <FreshnessBanner feed={feed} />

        {nextLaunch ? <LaunchHeroCard launch={nextLaunch} /> : <EmptyLaunches />}
      </section>

      {nextLaunch ? (
        <>
          <section className="mx-auto max-w-6xl px-5 py-4">
            <LaunchMissionPanel launch={nextLaunch} />
          </section>
          <ViewingSpotsSection launch={nextLaunch} />
        </>
      ) : null}

      <section className="border-y border-slate-800 bg-slate-900/60 py-8">
        <div className="mx-auto grid max-w-6xl gap-4 px-5 sm:grid-cols-3">
          {[
            ["Mission clarity", "Countdown, pad, status, and provider are visible at a glance."],
            ["Outdoor first", "Dark high-contrast surfaces and large controls are tuned for launch-day use."],
            ["Tourism connected", "Launch Mode points visitors back to Space Coast places and tours."]
          ].map(([label, detail]) => (
            <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-4" key={label}>
              <p className="font-black text-slate-50">{label}</p>
              <p className="mt-1 text-sm leading-6 text-slate-300">{detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10" id="upcoming-launches">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-black uppercase text-cyan-200">Schedule</p>
            <h2 className="mt-1 text-3xl font-black text-slate-50">Upcoming Launches</h2>
          </div>
          <Link
            className="inline-flex min-h-11 items-center rounded-md bg-cyan-300 px-4 text-sm font-black text-slate-950 hover:bg-cyan-200"
            href="/space-coast"
          >
            Explore the Space Coast
          </Link>
        </div>

        {launches.length > 0 ? (
          <div className="mt-5 grid gap-4">
            {launches.map((launch) => (
              <LaunchListItem key={launch.id} launch={launch} />
            ))}
          </div>
        ) : (
          <div className="mt-5">
            <EmptyLaunches />
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-12">
        <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-5">
          <p className="text-sm font-black uppercase text-cyan-200">Launch-day reminder</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Launch schedules change often. Confirm official sources, road closures, parking,
            viewing rules, and weather before traveling to a viewing location.
          </p>
          {nextLaunch ? (
            <p className="mt-3 text-sm font-semibold text-slate-400">
              Active vehicle: {launchVehicleName(nextLaunch)}
            </p>
          ) : null}
        </div>
      </section>
    </main>
  );
}
