import Link from "next/link";
import { tours } from "../../lib/content";

const premiumFeatures = [
  {
    title: "Full Landmark Stories",
    detail: "Deeper history, context, and then-and-now interpretation after the free stop summary."
  },
  {
    title: "Audio Narration",
    detail: "Hands-free stories while walking, with replay controls for each stop."
  },
  {
    title: "Offline Access",
    detail: "Save tours before walking so spotty signal does not interrupt the experience."
  },
  {
    title: "Food and Shop Pairings",
    detail: "Nearby places to eat, browse, or pause after each stop, curated around the route."
  },
  {
    title: "Custom Itineraries",
    detail: "Build a plan around time, interests, weather, family needs, and parking."
  },
  {
    title: "Cruise Timing Helper",
    detail: "Plan conservative port-day routes with return buffers and short stop options."
  }
];

export const metadata = {
  title: "Premium | Space Coast Explorer",
  description: "Preview premium Space Coast Explorer features."
};

export default function PremiumPage() {
  const featuredTour = tours.find((tour) => tour.slug === "cocoa-village-historic-explorer") ?? tours[0];

  return (
    <main className="bg-[#f7fbfb]">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-12">
          <p className="text-sm font-black uppercase text-teal-700">Premium Preview</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight text-slate-950 sm:text-6xl">
            Keep the basics free. Unlock the richer trip.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700">
            Space Coast Explorer should be useful before anyone pays. Premium adds the deeper,
            more convenient layer for visitors who want narration, offline access, itineraries,
            and better local decisions while they are already exploring.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              className="inline-flex min-h-12 items-center justify-center rounded-md bg-teal-700 px-5 text-sm font-black text-white hover:bg-teal-800"
              href={featuredTour ? `/tours/${featuredTour.slug}/start` : "/tours"}
            >
              Use Free Tour
            </Link>
            <Link
              className="inline-flex min-h-12 items-center justify-center rounded-md border border-slate-300 bg-white px-5 text-sm font-black text-slate-900 hover:border-teal-700 hover:text-teal-800"
              href="/tours"
            >
              Browse Tours
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-5 py-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-black uppercase text-teal-700">Free</p>
          <h2 className="mt-2 text-3xl font-black text-slate-950">Worth using on its own</h2>
          <ul className="mt-5 grid gap-3 text-sm leading-6 text-slate-700">
            <li>Browse destination guides and tour filters.</li>
            <li>Complete selected walking routes from start to finish.</li>
            <li>Use the interactive map, clickable stops, directions, and manual progress.</li>
            <li>Read short landmark summaries and basic visitor context.</li>
            <li>Track stops completed, distance traveled, elapsed time, and next-stop distance.</li>
          </ul>
        </div>

        <div className="rounded-lg border border-teal-200 bg-teal-50 p-6 shadow-sm">
          <p className="text-sm font-black uppercase text-teal-800">Premium</p>
          <h2 className="mt-2 text-3xl font-black text-slate-950">The guided layer</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {premiumFeatures.map((feature) => (
              <div className="rounded-lg border border-white/80 bg-white p-4" key={feature.title}>
                <h3 className="font-black text-slate-950">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-700">{feature.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
