import Link from "next/link";
import {
  type Launch,
  type LaunchFeedState,
  formatLaunchDate,
  formatLaunchWindow,
  launchStatusClass,
  launchStatusLabel
} from "../../lib/launches";

function FreshnessBanner({ feed }: { feed: LaunchFeedState }) {
  if (feed.status === "ready" && feed.dataFreshness === "stale") {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-950">
        Launch data is temporarily stale. Showing the last successful update while the provider is
        unavailable.
      </div>
    );
  }

  if (feed.status === "unavailable") {
    const message =
      feed.reason === "api_not_configured"
        ? "Launch API hosting is not connected for this web environment yet."
        : "Launch data is temporarily unavailable.";
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-700 shadow-sm">
        {message} Cocoa Village tours are still available while launch data is being connected.
      </div>
    );
  }

  return null;
}

function LaunchStatusPill({ status }: { status: Launch["status"] }) {
  return (
    <span className={`inline-flex rounded-md px-3 py-1 text-xs font-black ${launchStatusClass(status)}`}>
      {launchStatusLabel(status)}
    </span>
  );
}

function LaunchMeta({ launch }: { launch: Launch }) {
  const provider = launch.launch_provider.abbreviation ?? launch.launch_provider.name ?? "Provider";
  const padName = launch.pad?.name ?? "Pad pending";
  const locationName = launch.pad?.location_name ?? "Space Coast";

  return (
    <dl className="grid gap-3 text-sm sm:grid-cols-2">
      <div className="rounded-lg bg-slate-50 p-4">
        <dt className="font-black text-slate-950">Rocket</dt>
        <dd className="mt-1 text-slate-700">{launch.rocket?.full_name ?? launch.rocket?.name ?? "Rocket pending"}</dd>
      </div>
      <div className="rounded-lg bg-slate-50 p-4">
        <dt className="font-black text-slate-950">Provider</dt>
        <dd className="mt-1 text-slate-700">{provider}</dd>
      </div>
      <div className="rounded-lg bg-slate-50 p-4">
        <dt className="font-black text-slate-950">Pad</dt>
        <dd className="mt-1 text-slate-700">{padName}</dd>
      </div>
      <div className="rounded-lg bg-slate-50 p-4">
        <dt className="font-black text-slate-950">Location</dt>
        <dd className="mt-1 text-slate-700">{locationName}</dd>
      </div>
    </dl>
  );
}

function NextLaunchCard({ launch }: { launch: Launch }) {
  return (
    <section className="rounded-lg border border-teal-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-black uppercase text-teal-800">Next Space Coast launch</p>
          <h2 className="mt-2 text-3xl font-black leading-tight text-slate-950 sm:text-5xl">{launch.name}</h2>
        </div>
        <LaunchStatusPill status={launch.status} />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-[1fr_0.8fr] md:items-start">
        <div>
          <p className="text-2xl font-black text-slate-950">{formatLaunchDate(launch.net)}</p>
          <p className="mt-2 text-sm font-semibold text-slate-600">{formatLaunchWindow(launch)}</p>
          {launch.mission?.description ? (
            <p className="mt-4 line-clamp-4 text-base leading-7 text-slate-700">
              {launch.mission.description}
            </p>
          ) : (
            <p className="mt-4 text-base leading-7 text-slate-700">
              Mission details are pending from the launch data provider.
            </p>
          )}
        </div>
        <LaunchMeta launch={launch} />
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <a
          className="inline-flex min-h-12 items-center justify-center rounded-md bg-teal-700 px-5 text-sm font-black text-white hover:bg-teal-800"
          href="#upcoming-launches"
        >
          View Upcoming Launches
        </a>
        <Link
          className="inline-flex min-h-12 items-center justify-center rounded-md border border-slate-300 px-5 text-sm font-black text-slate-800 hover:border-teal-700 hover:text-teal-800"
          href="/tours"
        >
          Explore Tours Nearby
        </Link>
      </div>
    </section>
  );
}

function LaunchListItem({ launch }: { launch: Launch }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-black leading-snug text-slate-950">{launch.name}</h2>
          <p className="mt-2 text-sm font-semibold text-slate-600">{formatLaunchDate(launch.net)}</p>
        </div>
        <LaunchStatusPill status={launch.status} />
      </div>
      <div className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-3">
        <p>
          <span className="font-black text-slate-950">Rocket:</span>{" "}
          {launch.rocket?.name ?? "Pending"}
        </p>
        <p>
          <span className="font-black text-slate-950">Pad:</span> {launch.pad?.name ?? "Pending"}
        </p>
        <p>
          <span className="font-black text-slate-950">Window:</span> {formatLaunchWindow(launch)}
        </p>
      </div>
    </article>
  );
}

function EmptyLaunches() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
      <h2 className="text-2xl font-black text-slate-950">No Space Coast launches available</h2>
      <p className="mt-2 text-slate-600">
        The provider did not return upcoming launches for the configured Florida pads.
      </p>
    </div>
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
    <main className="bg-[#f7fbfb]">
      <section className="mx-auto grid max-w-6xl gap-5 px-5 py-8 sm:py-12">
        <div className="grid gap-5 lg:grid-cols-[1fr_320px] lg:items-end">
          <div>
            <p className="text-sm font-black uppercase text-orange-700">Launch mode</p>
            <h1 className="mt-2 text-4xl font-black leading-tight text-slate-950 sm:text-6xl">
              Space Coast Launches
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-700">
              See upcoming Florida launch activity from a normalized Space Coast Explorer feed.
              Times are shown in Eastern time and should be confirmed before travel.
            </p>
          </div>
          <aside className="rounded-lg border border-white bg-white p-5 shadow-sm">
            <p className="text-sm font-black uppercase text-teal-800">Data status</p>
            <p className="mt-2 text-2xl font-black text-slate-950">
              {feed.status === "ready" ? feed.dataFreshness : "Unavailable"}
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-600">Last update: {lastUpdated}</p>
          </aside>
        </div>

        <FreshnessBanner feed={feed} />

        {nextLaunch ? <NextLaunchCard launch={nextLaunch} /> : <EmptyLaunches />}
      </section>

      <section className="border-y border-slate-200 bg-white py-8">
        <div className="mx-auto grid max-w-6xl gap-4 px-5 sm:grid-cols-3">
          {[
            ["Normalized feed", "The UI reads Space Coast Explorer launch data, not provider internals."],
            ["Florida pads", "Configured to focus on Kennedy Space Center and Cape Canaveral pads."],
            ["Travel caution", "Launch dates move often. Confirm before making a viewing plan."]
          ].map(([label, detail]) => (
            <div className="rounded-lg bg-slate-50 p-4" key={label}>
              <p className="font-black text-slate-950">{label}</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">{detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10" id="upcoming-launches">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-black uppercase text-teal-800">Schedule</p>
            <h2 className="mt-1 text-3xl font-black text-slate-950">Upcoming Launches</h2>
          </div>
          <Link
            className="inline-flex min-h-11 items-center rounded-md bg-teal-700 px-4 text-sm font-black text-white hover:bg-teal-800"
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
    </main>
  );
}
