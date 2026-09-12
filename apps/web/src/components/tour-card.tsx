import type { TourSummary } from "@space-coast-explorer/types";
import Image from "next/image";
import Link from "next/link";

export function TourCard({ tour }: { tour: TourSummary }) {
  return (
    <article className="group overflow-hidden rounded-lg border border-white/70 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.10)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.16)]">
      <div className="relative">
        <Image
          alt={tour.imageAlt}
          className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
          height={320}
          src={tour.imageUrl}
          width={560}
        />
        <span className="absolute left-4 top-4 rounded-md bg-amber-300 px-3 py-1 text-xs font-black text-slate-950">
          {tour.priceLabel}
        </span>
      </div>
      <div className="grid gap-3 p-5">
        <p className="text-sm font-black uppercase text-teal-700">{tour.destinationName}</p>
        <h3 className="text-xl font-bold text-slate-950">{tour.title}</h3>
        <p className="text-sm leading-6 text-slate-600">{tour.summary}</p>
        <div className="flex flex-wrap gap-2 text-xs font-bold text-slate-700">
          <span className="rounded-md bg-cyan-50 px-2.5 py-1">{tour.transportMode}</span>
          <span className="rounded-md bg-cyan-50 px-2.5 py-1">{tour.durationMinutes} min</span>
          <span className="rounded-md bg-cyan-50 px-2.5 py-1">{tour.distanceMiles} mi</span>
          <span className="rounded-md bg-cyan-50 px-2.5 py-1">{tour.stopCount} stops</span>
        </div>
        <Link
          className="mt-2 inline-flex w-fit rounded-md bg-teal-700 px-4 py-2 text-sm font-bold text-white hover:bg-teal-800"
          href={`/tours/${tour.slug}`}
        >
          View Tour
        </Link>
      </div>
    </article>
  );
}
