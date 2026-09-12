import Image from "next/image";
import { DestinationCard } from "../../components/destination-card";
import { TourCard } from "../../components/tour-card";
import { destinationTours, destinations, getDestination } from "../../lib/content";

export const metadata = {
  title: "Florida's Space Coast | Space Coast Explorer",
  description: "Explore Cocoa Village, Cocoa Beach, and Port Canaveral."
};

export default function SpaceCoastPage() {
  const destination = getDestination("space-coast");
  const areas = destinations.filter((item) => item.slug !== "space-coast");

  if (!destination) {
    return null;
  }

  return (
    <main>
      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="text-sm font-bold uppercase text-teal-700">{destination.eyebrow}</p>
            <h1 className="mt-3 text-5xl font-bold text-slate-950">{destination.name}</h1>
            <p className="mt-5 text-lg leading-8 text-slate-700">{destination.summary}</p>
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
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-3xl font-bold text-slate-950">Initial Explorer Areas</h2>
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {areas.map((area) => (
              <DestinationCard destination={area} key={area.slug} />
            ))}
          </div>
        </div>
      </section>
      <section className="bg-sky-50 py-12">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-3xl font-bold text-slate-950">Featured Tours</h2>
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {areas.flatMap((area) => destinationTours(area.slug)).map((tour) => (
              <TourCard key={tour.slug} tour={tour} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
