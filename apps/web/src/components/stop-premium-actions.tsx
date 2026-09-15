"use client";

import type { TourDetail, TourStop } from "@space-coast-explorer/types";
import { useEffect, useState } from "react";
import { EntitlementProvider, LockedFeatureButton, PremiumBadge, UpgradeSheet, useEntitlements } from "./premium-gates";
import { hasEntitlement } from "../lib/entitlements";
import { recordVisitorAnalyticsEvent } from "../lib/visitor-analytics";

function StopPremiumActionsContent({ stop, tour }: { stop: TourStop; tour: TourDetail }) {
  const { userEntitlements } = useEntitlements();
  const [fullStoryOpen, setFullStoryOpen] = useState(false);
  const [gateOpen, setGateOpen] = useState(false);
  const canReadFullStory = hasEntitlement(userEntitlements, "full_stories");
  const hasFullStory = Boolean(stop.fullStory ?? stop.visitorStory);

  useEffect(() => {
    void recordVisitorAnalyticsEvent(tour, "stop_viewed", {
      plan: userEntitlements.plan,
      source: "stop_page",
      stopSlug: stop.slug
    });
  }, [stop.slug, tour, userEntitlements.plan]);

  function readFullStory() {
    if (!canReadFullStory) {
      setGateOpen(true);
      return;
    }

    setFullStoryOpen(true);
    void recordVisitorAnalyticsEvent(tour, "full_story_opened", {
      feature: "full_stories",
      plan: userEntitlements.plan,
      source: "stop_page",
      stopSlug: stop.slug
    });
  }

  return (
    <section className="mt-6 rounded-lg border border-teal-100 bg-white p-4" aria-label="Explorer Pass features">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <PremiumBadge />
          <h3 className="mt-2 text-xl font-black text-slate-950">Make This Stop Richer</h3>
        </div>
        <p className="text-sm font-bold text-slate-600">$5.99 / 24 hours</p>
      </div>

      {stop.premiumStoryTeaser ? <p className="mt-3 text-sm leading-6 text-slate-700">{stop.premiumStoryTeaser}</p> : null}

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          className="min-h-11 rounded-md border border-teal-300 bg-white px-4 text-sm font-black text-teal-900"
          disabled={!hasFullStory}
          onClick={readFullStory}
          type="button"
        >
          Read Full Story <span className="sr-only">{canReadFullStory ? "" : "requires Explorer Pass"}</span>
        </button>
        <LockedFeatureButton entitlement="audio_guides" feature="audio_guides" implemented={Boolean(stop.audioUrl)} source="stop_page" tour={tour} unavailableLabel="Audio guide coming soon">
          Listen to Story
        </LockedFeatureButton>
        <LockedFeatureButton entitlement="then_and_now" feature="then_and_now" implemented={Boolean(stop.thenAndNow)} source="stop_page" tour={tour} unavailableLabel="Then & Now coming soon">
          Then & Now
        </LockedFeatureButton>
      </div>

      {fullStoryOpen ? (
        <div className="mt-4 rounded-md bg-slate-50 p-4 text-sm leading-6 text-slate-700">
          <p>{stop.fullStory ?? stop.visitorStory}</p>
        </div>
      ) : null}
      {gateOpen ? <UpgradeSheet feature="full_stories" onDismiss={() => setGateOpen(false)} source="stop_page" tour={tour} /> : null}
    </section>
  );
}

export function StopPremiumActions({ stop, tour }: { stop: TourStop; tour: TourDetail }) {
  return (
    <EntitlementProvider>
      <StopPremiumActionsContent stop={stop} tour={tour} />
    </EntitlementProvider>
  );
}
