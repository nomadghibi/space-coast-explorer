import Link from "next/link";
import { TourCard } from "../../components/tour-card";
import { filterTours } from "../../lib/content";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const filters = {
  destination: ["all", "cocoa-village", "cocoa-beach", "port-canaveral"],
  category: ["all", "History", "Beach", "Space", "Food", "Family", "Cruise"],
  duration: ["all", "under-1-hour", "1-2-hours", "2-plus-hours"],
  mode: ["all", "Walking", "Driving", "Mixed"],
  price: ["all", "free", "premium"]
};

function valueOf(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function filterHref(key: string, value: string) {
  const params = new URLSearchParams();
  if (value !== "all") {
    params.set(key, value);
  }
  const query = params.toString();
  return query ? `/tours?${query}` : "/tours";
}

function isActiveFilter(activeValue: string | undefined, value: string) {
  return (activeValue ?? "all") === value;
}

export const metadata = {
  title: "Tours | Space Coast Explorer",
  description: "Browse self-guided Space Coast experiences."
};

export default async function ToursPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const activeFilters = {
    destination: valueOf(params.destination),
    category: valueOf(params.category),
    duration: valueOf(params.duration),
    mode: valueOf(params.mode),
    price: valueOf(params.price)
  };
  const visibleTours = filterTours(activeFilters);

  return (
    <main className="mx-auto max-w-6xl px-5 py-12">
      <section className="grid gap-6 lg:grid-cols-[1fr_340px] lg:items-end">
        <div>
          <p className="text-sm font-black uppercase text-teal-800">Self-guided routes</p>
          <h1 className="mt-2 text-4xl font-black text-slate-950">Explore Tours</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-700">
            Pick a route by place, time, pace, and interest. Every tour supports manual progress,
            so weak location signal never blocks the experience.
          </p>
        </div>
        <div className="rounded-lg border border-teal-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-black uppercase text-orange-700">Before you start</p>
          <div className="mt-3 grid gap-2 text-sm font-semibold text-slate-700">
            <p>Check weather and daylight.</p>
            <p>Confirm parking and restricted areas.</p>
            <p>Use manual completion anytime GPS is weak.</p>
          </div>
        </div>
      </section>
      <div className="mt-8 grid gap-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        {Object.entries(filters).map(([key, values]) => (
          <div key={key}>
            <p className="text-sm font-bold capitalize text-slate-900">{key}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {values.map((value) => {
                const active = isActiveFilter(activeFilters[key as keyof typeof activeFilters], value);
                return (
                  <Link
                    className={`rounded-md border px-3 py-2 text-sm font-semibold capitalize ${
                      active
                        ? "border-teal-700 bg-teal-700 text-white"
                        : "border-slate-300 bg-white text-slate-800 hover:border-teal-700 hover:text-teal-800"
                    }`}
                    href={filterHref(key, value)}
                    key={value}
                  >
                    {value.replaceAll("-", " ")}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {visibleTours.length > 0 ? (
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {visibleTours.map((tour) => (
            <TourCard key={tour.slug} tour={tour} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-2xl font-black text-slate-950">No tours match those filters</h2>
          <p className="mt-2 text-slate-600">Try another destination, category, or visit length.</p>
          <Link className="mt-5 inline-flex rounded-md bg-teal-700 px-4 py-2 text-sm font-bold text-white" href="/tours">
            Reset filters
          </Link>
        </div>
      )}
    </main>
  );
}
