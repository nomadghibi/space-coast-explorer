import Image from "next/image";
import { notFound } from "next/navigation";
import { RoutePreview } from "../../../components/route-preview";
import { TourCard } from "../../../components/tour-card";
import { destinationTours, destinations, getDestination } from "../../../lib/content";

type PageProps = {
  params: Promise<{ slug: string }>;
};

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

  return (
    <main>
      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="text-sm font-bold uppercase text-teal-700">{destination.eyebrow}</p>
            <h1 className="mt-3 text-5xl font-bold text-slate-950">{destination.name}</h1>
            <p className="mt-5 text-lg leading-8 text-slate-700">{destination.summary}</p>
            <div className="mt-6 grid gap-3 text-sm text-slate-700">
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
    </main>
  );
}
