import Link from "next/link";
import { notFound } from "next/navigation";
import { RoutePreview } from "../../../../components/route-preview";
import { getTour, tours } from "../../../../lib/content";

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
    title: tour ? `Start ${tour.title} | Space Coast Explorer` : "Start Tour",
    description: tour?.summary ?? "Start a self-guided Space Coast tour."
  };
}

export default async function TourStartPage({ params }: PageProps) {
  const { slug } = await params;
  const tour = getTour(slug);

  if (!tour) {
    notFound();
  }

  const firstStop = tour.stops[0];

  return (
    <main className="bg-[#f7fbfb]">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 lg:grid-cols-[1fr_0.85fr]">
          <div>
            <p className="text-sm font-black uppercase text-teal-700">{tour.destinationName}</p>
            <h1 className="mt-3 text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
              {tour.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700">{tour.description}</p>
            <div className="mt-7 flex flex-wrap gap-2 text-sm font-bold text-slate-800">
              <span className="rounded-md bg-amber-100 px-3 py-2">{tour.durationMinutes} Minutes</span>
              <span className="rounded-md bg-amber-100 px-3 py-2">{tour.distanceMiles} Miles</span>
              <span className="rounded-md bg-amber-100 px-3 py-2">{tour.stopCount} Stops</span>
              <span className="rounded-md bg-amber-100 px-3 py-2">{tour.transportMode}</span>
            </div>
            {firstStop ? (
              <Link
                className="mt-8 inline-flex rounded-md bg-teal-700 px-5 py-3 text-sm font-black text-white hover:bg-teal-800"
                href={`/tours/${tour.slug}/stops/${firstStop.slug}`}
              >
                Begin at Stop 1
              </Link>
            ) : null}
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-950 p-6 text-white shadow-xl">
            <p className="text-sm font-black uppercase text-amber-300">Progress</p>
            <p className="mt-3 text-5xl font-black">0 / {tour.stopCount}</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Start when your group is ready, then move stop by stop using manual navigation.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="grid gap-6">
          <RoutePreview tour={tour} />
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-2xl font-black text-slate-950">Route Overview</h2>
            <p className="mt-3 leading-7 text-slate-700">{tour.staticRouteSummary}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-2xl font-black text-slate-950">Safety & Accessibility</h2>
            <p className="mt-3 leading-7 text-slate-700">{tour.accessibilitySummary}</p>
            <ul className="mt-4 grid gap-2 text-sm text-slate-700">
              {tour.safetyNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-black text-slate-950">Stops</h2>
          <ol className="mt-6 grid gap-4">
            {tour.stops.map((stop) => (
              <li className="rounded-lg border border-slate-200 bg-white p-4" key={stop.slug}>
                <p className="text-sm font-black text-teal-700">Stop {stop.sequence}</p>
                <h3 className="mt-1 text-xl font-bold text-slate-950">{stop.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-700">{stop.summary}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
