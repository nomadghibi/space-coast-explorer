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
      <h1 className="text-4xl font-bold text-slate-950">Explore Tours</h1>
      <p className="mt-4 max-w-2xl text-lg text-slate-700">
        Browse public self-guided experience previews for the first Space Coast Explorer areas.
      </p>
      <div className="mt-8 grid gap-5">
        {Object.entries(filters).map(([key, values]) => (
          <div key={key}>
            <p className="text-sm font-bold capitalize text-slate-900">{key}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {values.map((value) => (
                <Link className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800" href={filterHref(key, value)} key={value}>
                  {value.replaceAll("-", " ")}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {visibleTours.map((tour) => (
          <TourCard key={tour.slug} tour={tour} />
        ))}
      </div>
    </main>
  );
}
