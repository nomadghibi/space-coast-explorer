import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { DestinationPoi } from "@space-coast-explorer/types";
import { PersistentTourCta } from "../../../components/persistent-tour-cta";
import { RoutePreview } from "../../../components/route-preview";
import { TourCard } from "../../../components/tour-card";
import {
  destinationPoiCluster,
  destinationTours,
  destinations,
  featuredDestinationPois,
  getDestination
} from "../../../lib/content";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function PoiImages({ poi, size }: { poi: DestinationPoi; size: "compact" | "large" }) {
  if (!poi.imageUrl) {
    return null;
  }

  const primaryHeightClass = size === "large" ? "h-56" : "h-44";
  const secondaryHeightClass = size === "large" ? "h-56" : "h-44";
  const width = size === "large" ? 760 : 640;
  const height = size === "large" ? 480 : 420;

  if (poi.secondaryImageUrl) {
    return (
      <div className="grid grid-cols-2">
        <Image
          alt={poi.imageAlt ?? poi.name}
          className={`${primaryHeightClass} w-full object-cover`}
          height={height}
          src={poi.imageUrl}
          width={width}
        />
        <Image
          alt={poi.secondaryImageAlt ?? poi.name}
          className={`${secondaryHeightClass} w-full object-cover`}
          height={height}
          src={poi.secondaryImageUrl}
          width={width}
        />
      </div>
    );
  }

  return (
    <Image
      alt={poi.imageAlt ?? poi.name}
      className={`${primaryHeightClass} w-full object-cover`}
      height={height}
      src={poi.imageUrl}
      width={width}
    />
  );
}

export function generateStaticParams() {
  return destinations
    .filter((destination) => destination.slug !== "space-coast")
    .map((destination) => ({ slug: destination.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const destination = getDestination(slug);

  return {
    title: destination ? `${destination.name} | Space Coast Explorer` : "Destination",
    description: destination?.summary ?? "Explore a Space Coast destination."
  };
}

export default async function DestinationPage({ params }: PageProps) {
  const { slug } = await params;
  const destination = getDestination(slug);

  if (!destination || destination.slug === "space-coast") {
    notFound();
  }

  const tours = destinationTours(destination.slug);
  const previewTour = tours[0];
  const pois = destinationPoiCluster(destination.slug);
  const featuredPois = featuredDestinationPois(destination.slug);
  const contextualPois = pois.filter((poi) => poi.description?.length);
  const poiCategories = Array.from(new Set(pois.map((poi) => poi.category)));

  return (
    <main className={previewTour ? "pb-24 md:pb-0" : undefined}>
      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-8 sm:py-12 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="text-sm font-bold uppercase text-teal-700">{destination.eyebrow}</p>
            <h1 className="mt-3 text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">{destination.name}</h1>
            <p className="mt-4 text-base leading-7 text-slate-700 sm:text-lg sm:leading-8">{destination.summary}</p>
            {previewTour ? (
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  className="inline-flex min-h-12 items-center justify-center rounded-md bg-teal-700 px-5 text-sm font-black text-white hover:bg-teal-800"
                  href={`/tours/${previewTour.slug}/start`}
                >
                  Start Tour
                </Link>
                <Link
                  className="inline-flex min-h-12 items-center justify-center rounded-md border border-slate-300 bg-white px-5 text-sm font-black text-slate-900 hover:border-teal-700 hover:text-teal-800"
                  href={`/tours/${previewTour.slug}/start#tour-map`}
                >
                  Open Map
                </Link>
              </div>
            ) : null}
            <div className="mt-6 hidden gap-3 text-sm text-slate-700 sm:grid">
              {destination.introduction.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <Image
            alt={destination.imageAlt}
            className="h-80 w-full rounded-lg object-cover"
            height={640}
            priority
            src={destination.imageUrl}
            width={960}
          />
        </div>
      </section>
      <section className="py-12">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="text-3xl font-bold text-slate-950">Highlights</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {destination.highlights.map((highlight) => (
                <span className="rounded-md bg-cyan-100 px-3 py-2 text-sm font-semibold text-cyan-950" key={highlight}>
                  {highlight}
                </span>
              ))}
            </div>
            <dl className="mt-8 grid gap-4 text-sm">
              {Object.entries(destination.quickInfo).map(([label, value]) => (
                <div className="border-b border-slate-200 pb-3" key={label}>
                  <dt className="font-bold capitalize text-slate-950">{label.replace(/([A-Z])/g, " $1")}</dt>
                  <dd className="mt-1 text-slate-700">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
          {previewTour ? <RoutePreview tour={previewTour} /> : null}
        </div>
      </section>
      {featuredPois.length > 0 ? (
        <section className="border-y border-slate-200 bg-white py-12">
          <div className="mx-auto max-w-6xl px-5">
            <p className="text-sm font-black uppercase text-teal-800">Destination cluster</p>
            <div className="mt-2 grid gap-4 lg:grid-cols-[0.8fr_1fr]">
              <div>
                <h2 className="text-3xl font-black text-slate-950">
                  Historic Cocoa Village Is More Than One Pin
                </h2>
                <p className="mt-3 text-slate-700">
                  The pilot model treats Cocoa Village as a layered cluster of historic landmarks,
                  waterfront spaces, shops, food, art, entertainment, events, and nearby extensions.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {poiCategories.map((category) => (
                  <span
                    className="rounded-md bg-slate-100 px-3 py-2 text-sm font-black text-slate-800"
                    key={category}
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {featuredPois.slice(0, 9).map((poi) => (
                <article className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50" key={poi.slug}>
                  <PoiImages poi={poi} size="compact" />
                  <div className="p-5">
                    <p className="text-xs font-black uppercase text-orange-700">{poi.category}</p>
                    <h3 className="mt-2 text-xl font-black text-slate-950">{poi.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{poi.summary}</p>
                    {poi.address ? <p className="mt-3 text-sm font-bold text-slate-800">{poi.address}</p> : null}
                    {poi.description ? (
                      <details className="mt-4 rounded-md border border-slate-200 bg-white p-3">
                        <summary className="cursor-pointer text-sm font-black text-teal-800">
                          Read more
                        </summary>
                        <div className="mt-3 grid gap-3 text-sm leading-6 text-slate-700">
                          {poi.description.map((paragraph) => (
                            <p key={paragraph}>{paragraph}</p>
                          ))}
                          {poi.sourceUrl ? (
                            <a className="font-black text-teal-800 underline-offset-4 hover:underline" href={poi.sourceUrl}>
                              Source
                            </a>
                          ) : null}
                        </div>
                      </details>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
            <p className="mt-5 text-sm font-semibold text-slate-600">
              {pois.length} Cocoa Village points are modeled. Restaurants, shops, events, and nightlife
              are flagged as dynamic data for future directory/calendar ingestion.
            </p>
          </div>
        </section>
      ) : null}
      {contextualPois.length > 0 ? (
        <section className="bg-[#f7fbfb] py-12">
          <div className="mx-auto max-w-6xl px-5">
            <div className="max-w-3xl">
              <p className="text-sm font-black uppercase text-teal-800">Places with context</p>
              <h2 className="mt-2 text-3xl font-black text-slate-950">
                Read More About {destination.name}
              </h2>
              <p className="mt-3 text-slate-700">
                These notes turn the destination from a list of pins into a walk with context:
                what to notice, why each place belongs on the route, and how it connects to the district.
              </p>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {contextualPois.map((poi) => (
                <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm" key={poi.slug}>
                  <PoiImages poi={poi} size="large" />
                  <div className="p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-black uppercase text-orange-700">{poi.category}</p>
                        <h3 className="mt-2 text-xl font-black text-slate-950">{poi.name}</h3>
                      </div>
                      {poi.address ? (
                        <p className="max-w-48 text-right text-xs font-bold leading-5 text-slate-600">{poi.address}</p>
                      ) : null}
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-700">{poi.summary}</p>
                    {poi.description ? (
                      <details className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-4">
                        <summary className="cursor-pointer text-sm font-black text-teal-800">
                          Read more
                        </summary>
                        <div className="mt-3 grid gap-3 text-sm leading-6 text-slate-700">
                          {poi.description.map((paragraph) => (
                            <p key={paragraph}>{paragraph}</p>
                          ))}
                          {poi.sourceUrl ? (
                            <a className="font-black text-teal-800 underline-offset-4 hover:underline" href={poi.sourceUrl}>
                              Source
                            </a>
                          ) : null}
                        </div>
                      </details>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}
      <section className="bg-sky-50 py-12">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-3xl font-bold text-slate-950">Related Experiences</h2>
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {tours.map((tour) => (
              <TourCard key={tour.slug} tour={tour} />
            ))}
          </div>
        </div>
      </section>
      {previewTour ? <PersistentTourCta tour={previewTour} /> : null}
    </main>
  );
}
