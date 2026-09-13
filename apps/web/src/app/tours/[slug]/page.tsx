import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PersistentTourCta } from "../../../components/persistent-tour-cta";
import { RoutePreview } from "../../../components/route-preview";
import { getTour, tours } from "../../../lib/content";
import { googleMapsDirectionsUrl } from "../../../lib/map-links";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return tours.map((tour) => ({ slug: tour.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const tour = getTour(slug);

  return {
    title: tour ? `${tour.title} | Space Coast Explorer` : "Tour",
    description: tour?.summary ?? "Explore a Space Coast tour."
  };
}

export default async function TourDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const tour = getTour(slug);

  if (!tour) {
    notFound();
  }

  const firstStop = tour.stops[0];
  const directionsUrl = googleMapsDirectionsUrl(firstStop?.location ?? tour.startPoint?.address ?? tour.startLocation);

  return (
    <main className="pb-24 md:pb-0">
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TouristTrip",
            name: tour.title,
            description: tour.summary,
            touristType: tour.categories,
            itinerary: tour.stops.map((stop) => stop.title)
          })
        }}
        type="application/ld+json"
      />
      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-8 sm:py-12 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="text-sm font-bold uppercase text-teal-700">{tour.destinationName}</p>
            <h1 className="mt-3 text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">{tour.title}</h1>
            <p className="mt-4 text-base leading-7 text-slate-700 sm:text-lg sm:leading-8">{tour.description}</p>
            <div className="mt-6 flex flex-wrap gap-2 text-sm font-bold text-slate-800">
              {[tour.transportMode, `${tour.durationMinutes} Minutes`, `${tour.distanceMiles} Miles`, `${tour.stopCount} Stops`, tour.priceLabel].map((badge) => (
                <span className="rounded-md bg-amber-100 px-3 py-2" key={badge}>{badge}</span>
              ))}
            </div>
            <div className="mt-6 grid gap-3 sm:flex sm:flex-wrap">
              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-md bg-teal-700 px-5 text-sm font-black text-white hover:bg-teal-800"
                href={`/tours/${tour.slug}/start`}
              >
                Start Tour
              </Link>
              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-md border border-slate-300 bg-white px-5 text-sm font-black text-slate-900 hover:border-teal-700 hover:text-teal-800"
                href={`/tours/${tour.slug}/start#tour-map`}
              >
                Open Map
              </Link>
              <a
                className="inline-flex min-h-12 items-center justify-center rounded-md border border-slate-300 bg-white px-5 text-sm font-black text-slate-900 hover:border-teal-700 hover:text-teal-800"
                href={directionsUrl}
                rel="noreferrer"
                target="_blank"
              >
                Directions
              </a>
            </div>
          </div>
          <Image
            alt={tour.imageAlt}
            className="h-80 w-full rounded-lg object-cover"
            height={640}
            priority
            src={tour.imageUrl}
            width={960}
          />
        </div>
      </section>
      <section className="py-12">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="text-3xl font-bold text-slate-950">Tour Summary</h2>
            <dl className="mt-6 grid gap-4 text-sm">
              <div><dt className="font-bold">Start Location</dt><dd className="text-slate-700">{tour.startLocation}</dd></div>
              <div><dt className="font-bold">Difficulty</dt><dd className="text-slate-700">{tour.difficulty}</dd></div>
              <div><dt className="font-bold">Accessibility</dt><dd className="text-slate-700">{tour.accessibilitySummary}</dd></div>
            </dl>
            {tour.startPoint ? (
              <div className="mt-8 rounded-lg border border-teal-100 bg-teal-50 p-5">
                <p className="text-sm font-black uppercase text-teal-800">Where to begin</p>
                <h2 className="mt-2 text-2xl font-black text-slate-950">{tour.startPoint.title}</h2>
                <p className="mt-1 font-bold text-slate-800">{tour.startPoint.address}</p>
                <p className="mt-3 text-sm leading-6 text-slate-700">{tour.startPoint.landmark}</p>
              </div>
            ) : null}
            <h2 className="mt-10 text-3xl font-bold text-slate-950">Stops</h2>
            <ol className="mt-6 grid gap-4">
              {tour.stops.map((stop) => (
                <li className="rounded-lg border border-slate-200 bg-white p-4" key={stop.sequence}>
                  <p className="text-sm font-bold text-teal-700">Stop {stop.sequence}</p>
                  <h3 className="mt-1 text-lg font-bold text-slate-950">{stop.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{stop.summary}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className="grid gap-6">
            <RoutePreview tour={tour} />
            {tour.startPoint ? (
              <div className="rounded-lg border border-slate-200 bg-white p-5">
                <h2 className="text-xl font-black text-slate-950">Arrival Checklist</h2>
                <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-700">
                  {tour.startPoint.arrivalTips.map((tip) => (
                    <li key={tip}>{tip}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div className="rounded-lg bg-slate-950 p-5 text-white">
              <p className="text-lg font-bold">Ready to Start?</p>
              <p className="mt-2 text-sm text-slate-300">
                Review the route and stops before beginning your experience. You can move through
                each stop manually at your own pace.
              </p>
              <Link
                className="mt-5 inline-flex min-h-12 items-center justify-center rounded-md bg-amber-300 px-5 text-sm font-black text-slate-950 hover:bg-amber-200"
                href={`/tours/${tour.slug}/start`}
              >
                Start Tour
              </Link>
            </div>
          </div>
        </div>
      </section>
      <PersistentTourCta tour={tour} />
    </main>
  );
}
