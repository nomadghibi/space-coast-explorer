import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RoutePreview } from "../../../components/route-preview";
import { getTour, tours } from "../../../lib/content";

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

  return (
    <main>
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
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="text-sm font-bold uppercase text-teal-700">{tour.destinationName}</p>
            <h1 className="mt-3 text-5xl font-bold text-slate-950">{tour.title}</h1>
            <p className="mt-5 text-lg leading-8 text-slate-700">{tour.description}</p>
            <div className="mt-6 flex flex-wrap gap-2 text-sm font-bold text-slate-800">
              {[tour.transportMode, `${tour.durationMinutes} Minutes`, `${tour.distanceMiles} Miles`, `${tour.stopCount} Stops`, tour.priceLabel].map((badge) => (
                <span className="rounded-md bg-amber-100 px-3 py-2" key={badge}>{badge}</span>
              ))}
            </div>
            <Link
              className="mt-8 inline-flex rounded-md bg-teal-700 px-5 py-3 text-sm font-black text-white hover:bg-teal-800"
              href={`/tours/${tour.slug}/start`}
            >
              Start This Tour
            </Link>
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
            <div className="rounded-lg bg-slate-950 p-5 text-white">
              <p className="text-lg font-bold">Ready to Start?</p>
              <p className="mt-2 text-sm text-slate-300">
                Review the route and stops before beginning your experience. You can move through
                each stop manually at your own pace.
              </p>
              <Link
                className="mt-5 inline-flex rounded-md bg-amber-300 px-4 py-2 text-sm font-black text-slate-950 hover:bg-amber-200"
                href={`/tours/${tour.slug}/start`}
              >
                Start This Tour
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
