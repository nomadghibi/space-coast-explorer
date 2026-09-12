import type { Destination } from "@space-coast-explorer/types";
import Image from "next/image";
import Link from "next/link";

export function DestinationCard({ destination }: { destination: Destination }) {
  const href = destination.slug === "space-coast" ? "/space-coast" : `/space-coast/${destination.slug}`;

  return (
    <article className="group overflow-hidden rounded-lg border border-white/70 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.10)] transition hover:-translate-y-1">
      <div className="relative">
        <Image
          alt={destination.imageAlt}
          className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
          height={320}
          src={destination.imageUrl}
          width={560}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 to-transparent" />
      </div>
      <div className="grid gap-3 p-5">
        <p className="text-sm font-black uppercase text-orange-700">{destination.eyebrow}</p>
        <h3 className="text-xl font-bold text-slate-950">{destination.name}</h3>
        <p className="text-sm leading-6 text-slate-600">{destination.summary}</p>
        <Link className="text-sm font-black text-teal-800 hover:text-teal-950" href={href}>
          Explore
        </Link>
      </div>
    </article>
  );
}
