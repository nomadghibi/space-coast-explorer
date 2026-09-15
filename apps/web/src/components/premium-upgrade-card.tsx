import type { TourDetail } from "@space-coast-explorer/types";
import Link from "next/link";

const defaultFreeIncludes = [
  "Browse destination guides",
  "Use basic tour maps and directions",
  "Track progress manually"
];

const defaultPremiumUnlocks = [
  "full_stories",
  "audio_guides",
  "offline_access",
  "custom_itineraries"
] as const;

const premiumFeatureLabels = {
  ai_local_guide: "AI Local Guide",
  audio_guides: "Audio narration",
  bonus_stops: "Bonus stops",
  cruise_planner: "Cruise planning",
  custom_itineraries: "Custom itinerary",
  full_stories: "Full landmark story",
  multiple_saved_tours: "Multiple saved tours",
  offline_access: "Offline access",
  smart_nearby: "Smart nearby ideas",
  then_and_now: "Then & Now history"
} as const;

export function PremiumUpgradeCard({ tour }: { tour: TourDetail }) {
  const freeIncludes = tour.premiumUpsell?.freeIncludes ?? defaultFreeIncludes;
  const premiumUnlocks = tour.premiumUpsell?.premiumUnlocks ?? [...defaultPremiumUnlocks];

  return (
    <section className="rounded-lg border border-teal-100 bg-white p-5 shadow-sm" aria-label="Free and premium access">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-black uppercase text-teal-700">Free Access</p>
          <h2 className="mt-1 text-2xl font-black text-slate-950">Useful now, richer with Premium</h2>
        </div>
        <span className="rounded-md bg-amber-100 px-3 py-2 text-xs font-black text-orange-900">
          Premium Preview
        </span>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-black text-slate-950">Free includes</p>
          <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-700">
            {freeIncludes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-teal-200 bg-teal-50 p-4">
          <p className="text-sm font-black text-teal-950">Premium unlocks</p>
          <ul className="mt-3 grid gap-2 text-sm leading-6 text-teal-950">
            {premiumUnlocks.map((item) => (
              <li key={item}>{premiumFeatureLabels[item]}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-teal-700 px-4 text-sm font-black text-white hover:bg-teal-800"
          href="/premium"
        >
          See Premium
        </Link>
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-black text-slate-900 hover:border-teal-700 hover:text-teal-800"
          href={`/tours/${tour.slug}/start`}
        >
          Keep Using Free
        </Link>
      </div>
    </section>
  );
}
