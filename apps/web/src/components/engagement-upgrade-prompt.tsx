"use client";

import type { TourDetail } from "@space-coast-explorer/types";
import { useEffect, useState } from "react";
import { explorerPassPriceLabel } from "../lib/entitlements";
import { recordVisitorAnalyticsEvent } from "../lib/visitor-analytics";

const promptStoragePrefix = "space-coast-explorer:upgrade-prompt-dismissed:";

export function EngagementUpgradePrompt({ completedCount, threshold = 3, tour }: { completedCount: number; threshold?: number; tour: TourDetail }) {
  const storageKey = `${promptStoragePrefix}${tour.slug}`;
  const [dismissed, setDismissed] = useState(() => (typeof window === "undefined" ? false : window.localStorage.getItem(storageKey) === "true"));

  const shouldShow = completedCount >= threshold && !dismissed;

  useEffect(() => {
    if (!shouldShow) {
      return;
    }

    void recordVisitorAnalyticsEvent(tour, "premium_gate_opened", {
      feature: "engagement_prompt",
      plan: "free",
      source: "engagement_prompt",
      upgradeTrigger: "three_stops_completed"
    });
  }, [shouldShow, tour]);

  function dismiss() {
    window.localStorage.setItem(storageKey, "true");
    setDismissed(true);
    void recordVisitorAnalyticsEvent(tour, "premium_gate_dismissed", {
      feature: "engagement_prompt",
      plan: "free",
      source: "engagement_prompt",
      upgradeTrigger: "three_stops_completed"
    });
  }

  function upgrade() {
    void recordVisitorAnalyticsEvent(tour, "premium_upgrade_clicked", {
      feature: "engagement_prompt",
      plan: "free",
      source: "engagement_prompt",
      upgradeTrigger: "three_stops_completed"
    });
  }

  if (!shouldShow) {
    return null;
  }

  return (
    <section className="fixed inset-x-3 bottom-28 z-[60] mx-auto max-w-lg rounded-lg border border-teal-200 bg-white p-5 shadow-2xl md:bottom-6" aria-label="Explorer Pass upgrade prompt">
      <p className="text-sm font-black uppercase text-teal-700">You&apos;re {completedCount} stops into {tour.destinationName}</p>
      <h2 className="mt-2 text-2xl font-black text-slate-950">Make the rest of your walk even better.</h2>
      <ul className="mt-4 grid gap-2 text-sm leading-6 text-slate-700">
        <li>Hear narrated landmark stories when audio is available.</li>
        <li>See Then & Now photos when licensed images are ready.</li>
        <li>Discover hidden stops and food/shop ideas as the pilot expands.</li>
      </ul>
      <p className="mt-4 rounded-md bg-teal-50 p-3 text-sm font-black text-teal-950">Explorer Pass: {explorerPassPriceLabel} / 24 hours</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <a className="inline-flex min-h-12 items-center justify-center rounded-md bg-teal-700 px-4 text-sm font-black text-white" href="/premium" onClick={upgrade}>
          Unlock Full Experience
        </a>
        <button className="min-h-12 rounded-md border border-slate-300 bg-white px-4 text-sm font-black text-slate-900" onClick={dismiss} type="button">
          Continue Free
        </button>
      </div>
    </section>
  );
}
