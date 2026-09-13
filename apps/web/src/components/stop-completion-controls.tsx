"use client";

import type { TourSessionState } from "@space-coast-explorer/maps";
import { useEffect, useState } from "react";
import { completeStop, loadTourSession, startTourSession } from "../lib/tour-session";

export function StopCompletionControls({
  tourSlug,
  firstStopSlug,
  stopSlug,
  orderedStopSlugs
}: {
  tourSlug: string;
  firstStopSlug: string;
  stopSlug: string;
  orderedStopSlugs: string[];
}) {
  const [session, setSession] = useState<TourSessionState | undefined>();

  useEffect(() => {
    const next = loadTourSession(tourSlug) ?? startTourSession(tourSlug, firstStopSlug);
    queueMicrotask(() => setSession(next));
  }, [firstStopSlug, tourSlug]);

  const completed = session?.completedStopSlugs.includes(stopSlug) ?? false;

  return (
    <button
      className="min-h-12 rounded-md bg-teal-700 px-5 text-sm font-black text-white hover:bg-teal-800 disabled:bg-slate-400"
      disabled={completed}
      onClick={() => {
        const activeSession = session ?? startTourSession(tourSlug, firstStopSlug);
        const next = completeStop(activeSession, orderedStopSlugs, stopSlug);
        setSession(next);
      }}
    >
      {completed ? "Stop Completed" : "Mark Completed"}
    </button>
  );
}
