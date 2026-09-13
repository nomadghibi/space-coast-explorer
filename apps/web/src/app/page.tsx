import Link from "next/link";
import { DestinationCard } from "../components/destination-card";
import { TourCard } from "../components/tour-card";
import { categories, destinations, tours } from "../lib/content";

export default function HomePage() {
  const destinationCards = destinations.filter((destination) => destination.slug !== "space-coast");

  return (
    <main>
      <section className="coastal-hero text-white">
        <div className="mx-auto flex min-h-[78vh] max-w-6xl flex-col justify-end px-5 pb-12 pt-28">
          <div className="max-w-3xl">
            <p className="w-fit rounded-md bg-amber-300 px-3 py-2 text-sm font-black uppercase text-slate-950">
              Florida&apos;s Space Coast
            </p>
            <h1 className="mt-5 max-w-3xl text-5xl font-black leading-tight sm:text-7xl">
              Explore Florida&apos;s Space Coast
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-100 sm:text-xl">
              Discover self-guided experiences, local stories, hidden places, beaches, space history,
              food, and more.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="rounded-md bg-amber-300 px-5 py-3 text-sm font-black text-slate-950 hover:bg-amber-200" href="/tours">
                Explore Tours
              </Link>
              <Link className="rounded-md border border-white/70 px-5 py-3 text-sm font-black text-white hover:bg-white/10" href="/space-coast">
                Discover the Space Coast
              </Link>
            </div>
          </div>
          <div className="glass-panel mt-10 grid gap-4 rounded-lg p-4 text-slate-950 shadow-2xl sm:grid-cols-3">
            <div>
              <p className="text-2xl font-black">3</p>
              <p className="text-sm font-semibold text-slate-600">pilot areas</p>
            </div>
            <div>
              <p className="text-2xl font-black">21</p>
              <p className="text-sm font-semibold text-slate-600">preview stops</p>
            </div>
            <div>
              <p className="text-2xl font-black">Free</p>
              <p className="text-sm font-semibold text-slate-600">starter routes</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white py-8">
        <div className="mx-auto grid max-w-6xl gap-4 px-5 md:grid-cols-4">
          {[
            ["Mobile first", "Designed for one-handed browsing on the route."],
            ["GPS optional", "Use location help or complete stops manually."],
            ["Cruise aware", "Keep port-day timing and return buffers in mind."],
            ["Pilot ready", "Measure completed visitor experiences."]
          ].map(([label, detail]) => (
            <div className="rounded-lg bg-slate-50 p-4" key={label}>
              <p className="font-black text-slate-950">{label}</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">{detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#fff8ed] py-16">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="max-w-2xl text-4xl font-black text-slate-950">What Do You Want to Experience?</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                className="rounded-lg border border-white/80 bg-white/85 px-5 py-5 font-black text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-cyan-50 hover:text-teal-900"
                href={`/tours?category=${encodeURIComponent(category.replace(" & Rocket", "").replace(" & Drink", ""))}`}
                key={category}
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-sm font-black uppercase text-orange-700">Start here</p>
          <h2 className="mt-2 text-4xl font-black text-slate-950">Featured Experiences</h2>
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {tours.map((tour) => (
              <TourCard key={tour.slug} tour={tour} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cyan-950 py-16 text-white">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-4xl font-black">Explore by Destination</h2>
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {destinationCards.map((destination) => (
              <DestinationCard destination={destination} key={destination.slug} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#10202a] py-16 text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 lg:grid-cols-3">
          {["Pick an Experience", "Follow the Route", "Discover the Story"].map((step, index) => (
            <div className="rounded-lg border border-white/10 bg-white/5 p-6" key={step}>
              <p className="grid size-10 place-items-center rounded-md bg-amber-300 text-sm font-black text-slate-950">{index + 1}</p>
              <h3 className="mt-5 text-2xl font-black">{step}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {index === 0 && "Choose where or what you want to explore."}
                {index === 1 && "Use the route preview to move between curated stops at your pace."}
                {index === 2 && "Listen, read, explore nearby places, and keep going when ready."}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-sm font-black uppercase text-teal-800">Pilot confidence</p>
          <div className="mt-3 grid gap-6 lg:grid-cols-[0.8fr_1fr]">
            <div>
              <h2 className="text-4xl font-black text-slate-950">Built for Real Visitor Conditions</h2>
              <p className="mt-4 text-slate-700">
                Start with a clear route, keep location optional, and finish manually if signal,
                weather, or accessibility conditions change.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Link className="rounded-lg border border-slate-200 bg-slate-50 p-5 font-black text-slate-950 hover:border-teal-700 hover:bg-teal-50" href="/tours/cocoa-village-historic-explorer/start">
                Start Pilot Tour
              </Link>
              <Link className="rounded-lg border border-slate-200 bg-slate-50 p-5 font-black text-slate-950 hover:border-teal-700 hover:bg-teal-50" href="/analytics">
                Pilot Metrics
              </Link>
              <Link className="rounded-lg border border-slate-200 bg-slate-50 p-5 font-black text-slate-950 hover:border-teal-700 hover:bg-teal-50" href="/privacy">
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#eef9fa] py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <p className="text-sm font-black uppercase text-teal-800">Port day</p>
            <h2 className="mt-2 text-4xl font-black text-slate-950">Visiting Before or After Your Cruise?</h2>
            <p className="mt-4 max-w-2xl text-slate-700">
              Discover curated Space Coast experiences designed around the time you have available near
              Port Canaveral.
            </p>
            <Link className="mt-6 inline-flex rounded-md bg-teal-800 px-5 py-3 text-sm font-black text-white hover:bg-teal-900" href="/space-coast/port-canaveral">
              Explore Port Canaveral
            </Link>
          </div>
          <div className="rounded-lg border border-white/80 bg-white p-6 shadow-xl">
            <p className="text-sm font-black uppercase text-orange-700">Cruise reminder</p>
            <p className="mt-3 text-slate-700">
              Keep your plan flexible and confirm ship boarding times, parking, and traffic before
              leaving the port area.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-3xl font-bold text-slate-950">Local Discovery</h2>
          <p className="mt-4 max-w-2xl text-slate-700">
            Find approachable routes, local stops, and destination context without clutter. Each
            experience is designed to help visitors choose a place, understand the pace, and start
            exploring with confidence.
          </p>
        </div>
      </section>
    </main>
  );
}
