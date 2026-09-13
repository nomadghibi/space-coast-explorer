"use client";

import type { TourDetail } from "@space-coast-explorer/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import { loadTourSession } from "../lib/tour-session";

export function PersistentTourCta({ tour }: { tour: TourDetail }) {
  const [completedCount, setCompletedCount] = useState(0);
  const [hasProgress, setHasProgress] = useState(false);

  useEffect(() => {
    const session = loadTourSession(tour.slug);

    if (session && !session.tourCompleted) {
      queueMicrotask(() => {
        setCompletedCount(session.completedStopSlugs.length);
        setHasProgress(true);
      });
    }
  }, [tour.slug]);

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-12px_34px_rgba(15,23,42,0.16)] backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-[1fr_auto] items-center gap-3">
        <div>
          <p className="text-xs font-black uppercase text-teal-800">
            {hasProgress ? `${completedCount} of ${tour.stopCount} complete` : tour.destinationName}
          </p>
          <p className="truncate text-sm font-black text-slate-950">{tour.title}</p>
        </div>
        <Link
          className="inline-flex min-h-12 items-center justify-center rounded-md bg-teal-700 px-5 text-sm font-black text-white hover:bg-teal-800"
          href={`/tours/${tour.slug}/start`}
        >
          {hasProgress ? "Continue Tour" : "Start Tour"}
        </Link>
      </div>
    </div>
  );
}
