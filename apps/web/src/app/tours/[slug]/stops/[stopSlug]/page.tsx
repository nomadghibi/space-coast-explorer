import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StopCompletionControls } from "../../../../../components/stop-completion-controls";
import { getTour, tours } from "../../../../../lib/content";
import { googleMapsDirectionsUrl } from "../../../../../lib/map-links";

type PageProps = {
  params: Promise<{ slug: string; stopSlug: string }>;
};

export function generateStaticParams() {
  return tours.flatMap((tour) =>
    tour.stops.map((stop) => ({
      slug: tour.slug,
      stopSlug: stop.slug
    }))
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { slug, stopSlug } = await params;
  const tour = getTour(slug);
  const stop = tour?.stops.find((candidate) => candidate.slug === stopSlug);

  return {
    title: tour && stop ? `${stop.title} | ${tour.title}` : "Tour Stop",
    description: stop?.summary ?? "Continue a self-guided Space Coast tour."
  };
}

export default async function TourStopPage({ params }: PageProps) {
  const { slug, stopSlug } = await params;
  const tour = getTour(slug);
  const stop = tour?.stops.find((candidate) => candidate.slug === stopSlug);

  if (!tour || !stop) {
    notFound();
  }

  const stopIndex = tour.stops.findIndex((candidate) => candidate.slug === stop.slug);
  const previousStop = stopIndex > 0 ? tour.stops[stopIndex - 1] : undefined;
  const nextStop = stopIndex < tour.stops.length - 1 ? tour.stops[stopIndex + 1] : undefined;
  const orderedStopSlugs = tour.stops.map((candidate) => candidate.slug);
  const firstStopSlug = orderedStopSlugs[0] ?? stop.slug;
  const directionsUrl = googleMapsDirectionsUrl(stop.location ?? `${stop.title}, ${tour.destinationName}`);

  return (
    <main className="bg-[#f7fbfb] pb-28 md:pb-0">
      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-6 sm:py-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="flex flex-wrap gap-2">
              <Link
                className="inline-flex min-h-11 items-center rounded-md border border-slate-300 bg-white px-4 text-sm font-black text-slate-900 hover:border-teal-700 hover:text-teal-800"
                href={previousStop ? `/tours/${tour.slug}/stops/${previousStop.slug}` : `/tours/${tour.slug}/start`}
              >
                Back
              </Link>
              <Link
                className="inline-flex min-h-11 items-center rounded-md border border-slate-300 bg-white px-4 text-sm font-black text-slate-900 hover:border-teal-700 hover:text-teal-800"
                href={`/tours/${tour.slug}/start#tour-map`}
              >
                Open Map
              </Link>
              <a
                className="inline-flex min-h-11 items-center rounded-md border border-slate-300 bg-white px-4 text-sm font-black text-slate-900 hover:border-teal-700 hover:text-teal-800"
                href={directionsUrl}
                rel="noreferrer"
                target="_blank"
              >
                Directions
              </a>
            </div>
            <p className="mt-8 text-sm font-black uppercase text-orange-700">{tour.title}</p>
            <div className="mt-3 flex items-center gap-4">
              <span className="grid size-16 shrink-0 place-items-center rounded-full bg-teal-700 text-2xl font-black text-white">
                {stop.sequence}
              </span>
              <div>
                <p className="text-base font-black text-slate-600">
                  Stop {stop.sequence} of {tour.stopCount}
                </p>
                <h1 className="mt-1 text-3xl font-black leading-tight text-slate-950 sm:text-5xl">
                  {stop.title}
                </h1>
              </div>
            </div>
            <p className="mt-5 text-base leading-7 text-slate-700 sm:text-lg sm:leading-8">{stop.summary}</p>
            {nextStop ? (
              <p className="mt-4 rounded-md bg-cyan-50 p-3 text-sm font-bold text-cyan-950">
                Next Stop: {nextStop.title}
              </p>
            ) : null}
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Stay on public sidewalks and crossings, follow posted rules, and choose the safest
              route for current conditions.
            </p>
          </div>
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl">
            <Image
              alt={stop.imageAlt ?? tour.imageAlt}
              className="h-72 w-full object-cover"
              height={520}
              priority
              src={tour.imageUrl}
              width={860}
            />
            <div className="grid grid-cols-2 divide-x divide-slate-200">
              <div className="p-5">
                <p className="text-sm font-bold text-slate-500">Progress</p>
                <p className="mt-1 text-2xl font-black text-slate-950">
                  {stop.sequence} / {tour.stopCount}
                </p>
              </div>
              <div className="p-5">
                <p className="text-sm font-bold text-slate-500">Mode</p>
                <p className="mt-1 text-2xl font-black text-slate-950">{tour.transportMode}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-12 lg:grid-cols-[1fr_0.75fr]">
        <article className="rounded-lg border border-slate-200 bg-white p-5 sm:p-6">
          <h2 className="text-2xl font-black text-slate-950">At This Stop</h2>
          <p className="mt-3 text-base leading-7 text-slate-700">{stop.summary}</p>
          {stop.visitorStory ? (
            <details className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-4">
              <summary className="cursor-pointer text-sm font-black text-teal-800">Read more</summary>
              <p className="mt-3 text-sm leading-6 text-slate-700">{stop.visitorStory}</p>
            </details>
          ) : null}
          <div className="mt-6">
            <StopCompletionControls
              firstStopSlug={firstStopSlug}
              orderedStopSlugs={orderedStopSlugs}
              stopSlug={stop.slug}
              tourSlug={tour.slug}
            />
          </div>
        </article>

        <aside className="grid gap-4">
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <p className="text-sm font-black uppercase text-teal-700">Tour</p>
            <h2 className="mt-2 text-xl font-black text-slate-950">{tour.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">{tour.destinationName}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {previousStop ? (
              <Link
                className="inline-flex min-h-14 items-center rounded-lg border border-slate-200 bg-white p-4 text-sm font-bold text-slate-800 hover:border-teal-600 hover:text-teal-800"
                href={`/tours/${tour.slug}/stops/${previousStop.slug}`}
              >
                Back: {previousStop.title}
              </Link>
            ) : (
              <Link
                className="inline-flex min-h-14 items-center rounded-lg border border-slate-200 bg-white p-4 text-sm font-bold text-slate-800 hover:border-teal-600 hover:text-teal-800"
                href={`/tours/${tour.slug}/start`}
              >
                Back to Route Overview
              </Link>
            )}
            {nextStop ? (
              <Link
                className="inline-flex min-h-14 items-center rounded-lg bg-teal-700 p-4 text-sm font-black text-white hover:bg-teal-800"
                href={`/tours/${tour.slug}/stops/${nextStop.slug}`}
              >
                Next Stop: {nextStop.title}
              </Link>
            ) : (
              <Link
                className="inline-flex min-h-14 items-center rounded-lg bg-slate-950 p-4 text-sm font-black text-white hover:bg-slate-800"
                href={`/tours/${tour.slug}`}
              >
                Finish Tour
              </Link>
            )}
          </div>
        </aside>
      </section>
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-12px_34px_rgba(15,23,42,0.16)] backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-lg gap-3">
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
            <span className="grid size-11 place-items-center rounded-full bg-teal-700 text-base font-black text-white">
              {stop.sequence}
            </span>
            <div className="min-w-0">
              <p className="text-xs font-black uppercase text-teal-800">
                Stop {stop.sequence} of {tour.stopCount}
              </p>
              <p className="truncate text-sm font-black text-slate-950">{stop.title}</p>
            </div>
            {nextStop ? (
              <Link
                className="inline-flex min-h-11 items-center justify-center rounded-md bg-teal-700 px-4 text-sm font-black text-white"
                href={`/tours/${tour.slug}/stops/${nextStop.slug}`}
              >
                Next Stop
              </Link>
            ) : (
              <Link
                className="inline-flex min-h-11 items-center justify-center rounded-md bg-teal-700 px-4 text-sm font-black text-white"
                href={`/tours/${tour.slug}`}
              >
                Finish
              </Link>
            )}
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-sm font-black text-slate-900"
              href={previousStop ? `/tours/${tour.slug}/stops/${previousStop.slug}` : `/tours/${tour.slug}/start`}
            >
              Back
            </Link>
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-sm font-black text-slate-900"
              href={`/tours/${tour.slug}/start#tour-map`}
            >
              Open Map
            </Link>
            <a
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-sm font-black text-slate-900"
              href={directionsUrl}
              rel="noreferrer"
              target="_blank"
            >
              Directions
            </a>
          </div>
        </div>
      </nav>
    </main>
  );
}
