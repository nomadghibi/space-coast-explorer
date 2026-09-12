import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StopCompletionControls } from "../../../../../components/stop-completion-controls";
import { getTour, tours } from "../../../../../lib/content";

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

  return (
    <main className="bg-[#f7fbfb]">
      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Link className="text-sm font-bold text-teal-700 hover:text-teal-900" href={`/tours/${tour.slug}/start`}>
              Back to route overview
            </Link>
            <p className="mt-8 text-sm font-black uppercase text-orange-700">{tour.title}</p>
            <p className="mt-3 text-lg font-bold text-slate-600">
              Stop {stop.sequence} of {tour.stopCount}
            </p>
            <h1 className="mt-2 text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
              {stop.title}
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-700">{stop.summary}</p>
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
        <article className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-2xl font-black text-slate-950">At This Stop</h2>
          <p className="mt-4 text-lg leading-8 text-slate-700">
            {stop.visitorStory ?? stop.summary}
          </p>
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
                className="rounded-lg border border-slate-200 bg-white p-4 text-sm font-bold text-slate-800 hover:border-teal-600 hover:text-teal-800"
                href={`/tours/${tour.slug}/stops/${previousStop.slug}`}
              >
                Previous Stop: {previousStop.title}
              </Link>
            ) : (
              <Link
                className="rounded-lg border border-slate-200 bg-white p-4 text-sm font-bold text-slate-800 hover:border-teal-600 hover:text-teal-800"
                href={`/tours/${tour.slug}/start`}
              >
                Back to Route Overview
              </Link>
            )}
            {nextStop ? (
              <Link
                className="rounded-lg bg-teal-700 p-4 text-sm font-black text-white hover:bg-teal-800"
                href={`/tours/${tour.slug}/stops/${nextStop.slug}`}
              >
                Next Stop: {nextStop.title}
              </Link>
            ) : (
              <Link
                className="rounded-lg bg-slate-950 p-4 text-sm font-black text-white hover:bg-slate-800"
                href={`/tours/${tour.slug}`}
              >
                Finish Tour
              </Link>
            )}
          </div>
        </aside>
      </section>
    </main>
  );
}
