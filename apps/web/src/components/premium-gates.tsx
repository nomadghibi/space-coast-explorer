"use client";

import type { AnalyticsEventName } from "@space-coast-explorer/analytics";
import type { PremiumFeature, TourDetail, UserEntitlements } from "@space-coast-explorer/types";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  activateDevelopmentExplorerPass,
  expireDevelopmentExplorerPass,
  explorerPassPriceLabel,
  freeEntitlements,
  hasEntitlement,
  isDevelopmentExplorerPassEnabled,
  loadUserEntitlements
} from "../lib/entitlements";
import { recordVisitorAnalyticsEvent } from "../lib/visitor-analytics";

type GateSource = "stop_page" | "active_tour" | "engagement_prompt" | "premium_page";

type EntitlementContextValue = {
  userEntitlements: UserEntitlements;
  refreshEntitlements: () => void;
  activateDevPass: () => void;
  expireDevPass: () => void;
  devControlsEnabled: boolean;
};

const EntitlementContext = createContext<EntitlementContextValue | undefined>(undefined);

export function EntitlementProvider({ children }: { children: React.ReactNode }) {
  const [userEntitlements, setUserEntitlements] = useState<UserEntitlements>(freeEntitlements);
  const devControlsEnabled = isDevelopmentExplorerPassEnabled();
  const value = useMemo<EntitlementContextValue>(
    () => ({
      userEntitlements,
      devControlsEnabled,
      refreshEntitlements: () => setUserEntitlements(loadUserEntitlements()),
      activateDevPass: () => setUserEntitlements(activateDevelopmentExplorerPass()),
      expireDevPass: () => setUserEntitlements(expireDevelopmentExplorerPass())
    }),
    [devControlsEnabled, userEntitlements]
  );

  useEffect(() => {
    queueMicrotask(() => setUserEntitlements(loadUserEntitlements()));
  }, []);

  return <EntitlementContext.Provider value={value}>{children}</EntitlementContext.Provider>;
}

export function useEntitlements() {
  const context = useContext(EntitlementContext);
  if (!context) {
    throw new Error("useEntitlements must be used inside EntitlementProvider");
  }
  return context;
}

export function PremiumBadge({ label = "Explorer Pass" }: { label?: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-teal-200 bg-teal-50 px-2.5 py-1 text-xs font-black uppercase text-teal-900">
      {label}
    </span>
  );
}

export function UpgradeSheet({
  feature,
  onDismiss,
  source,
  tour,
  upgradeTrigger = "premium_feature"
}: {
  feature: string;
  onDismiss: () => void;
  source: GateSource;
  tour: TourDetail;
  upgradeTrigger?: string;
}) {
  useEffect(() => {
    void recordVisitorAnalyticsEvent(tour, "premium_gate_opened", {
      feature,
      plan: "free",
      source,
      upgradeTrigger
    });
  }, [feature, source, tour, upgradeTrigger]);

  function dismiss() {
    void recordVisitorAnalyticsEvent(tour, "premium_gate_dismissed", {
      feature,
      plan: "free",
      source,
      upgradeTrigger
    });
    onDismiss();
  }

  function upgrade() {
    void recordVisitorAnalyticsEvent(tour, "premium_upgrade_clicked", {
      feature,
      plan: "free",
      source,
      upgradeTrigger
    });
    void recordVisitorAnalyticsEvent(tour, "checkout_started", {
      feature,
      plan: "free",
      source,
      upgradeTrigger
    });
  }

  return (
    <div className="fixed inset-0 z-[70] grid place-items-end bg-slate-950/45 px-3 pb-3 sm:place-items-center sm:p-5" role="presentation">
      <section
        aria-labelledby="upgrade-sheet-title"
        aria-modal="true"
        className="w-full max-w-lg rounded-lg bg-white p-5 shadow-2xl"
        role="dialog"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <PremiumBadge />
            <h2 className="mt-3 text-2xl font-black text-slate-950" id="upgrade-sheet-title">
              Unlock the full experience
            </h2>
          </div>
          <button className="min-h-11 rounded-md border border-slate-300 bg-white px-3 text-sm font-black text-slate-900" onClick={dismiss} type="button">
            Close
          </button>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-700">
          Explorer Pass adds richer stories, Then & Now history, bonus discoveries, and smarter planning as those pilot features become available.
        </p>
        <p className="mt-4 rounded-md bg-teal-50 p-3 text-sm font-black text-teal-950">
          {explorerPassPriceLabel} / 24 hours. The free walking tour still works from start to finish.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <a
            className="inline-flex min-h-12 items-center justify-center rounded-md bg-teal-700 px-4 text-sm font-black text-white hover:bg-teal-800"
            href="/premium"
            onClick={upgrade}
          >
            Unlock Full Experience
          </a>
          <button className="min-h-12 rounded-md border border-slate-300 bg-white px-4 text-sm font-black text-slate-900" onClick={dismiss} type="button">
            Continue Free
          </button>
        </div>
      </section>
    </div>
  );
}

export function LockedFeatureButton({
  children,
  entitlement,
  feature,
  implemented,
  source,
  tour,
  unavailableLabel
}: {
  children: React.ReactNode;
  entitlement: PremiumFeature;
  feature: string;
  implemented: boolean;
  source: GateSource;
  tour: TourDetail;
  unavailableLabel?: string;
}) {
  const { userEntitlements } = useEntitlements();
  const [gateOpen, setGateOpen] = useState(false);
  const allowed = hasEntitlement(userEntitlements, entitlement);
  const openedEventByEntitlement: Partial<Record<PremiumFeature, AnalyticsEventName>> = {
    audio_guides: "audio_guide_opened",
    full_stories: "full_story_opened",
    then_and_now: "then_and_now_opened"
  };

  function openFeature() {
    void recordVisitorAnalyticsEvent(tour, openedEventByEntitlement[entitlement] ?? "premium_feature_viewed", {
      feature,
      plan: userEntitlements.plan,
      source
    });
  }

  if (allowed && !implemented) {
    return (
      <button className="min-h-11 rounded-md border border-slate-300 bg-white px-4 text-sm font-black text-slate-700" disabled type="button">
        {unavailableLabel ?? "Planned Premium Feature"}
      </button>
    );
  }

  if (allowed) {
    return (
      <button className="min-h-11 rounded-md bg-teal-700 px-4 text-sm font-black text-white" onClick={openFeature} type="button">
        {children}
      </button>
    );
  }

  return (
    <>
      <button
        className="min-h-11 rounded-md border border-teal-300 bg-white px-4 text-sm font-black text-teal-900"
        onClick={() => {
          void recordVisitorAnalyticsEvent(tour, "premium_feature_viewed", {
            feature,
            plan: "free",
            source
          });
          setGateOpen(true);
        }}
        type="button"
      >
        {children} <span className="sr-only">requires Explorer Pass</span>
      </button>
      {gateOpen ? <UpgradeSheet feature={feature} onDismiss={() => setGateOpen(false)} source={source} tour={tour} /> : null}
    </>
  );
}

export function ExplorerPassDevControls({ tour }: { tour?: TourDetail }) {
  const { activateDevPass, devControlsEnabled, expireDevPass, userEntitlements } = useEntitlements();

  if (!devControlsEnabled) {
    return null;
  }

  return (
    <section className="rounded-lg border border-amber-200 bg-amber-50 p-4">
      <p className="text-sm font-black uppercase text-amber-950">Development Explorer Pass</p>
      <p className="mt-2 text-sm text-amber-950">Current plan: {userEntitlements.plan}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          className="min-h-11 rounded-md bg-teal-700 px-4 text-sm font-black text-white"
          onClick={() => {
            activateDevPass();
            if (tour) {
              void recordVisitorAnalyticsEvent(tour, "explorer_pass_activated", {
                plan: "explorer_pass",
                source: "premium_page"
              });
              void recordVisitorAnalyticsEvent(tour, "purchase_completed", {
                plan: "explorer_pass",
                source: "premium_page"
              });
            }
          }}
          type="button"
        >
          Activate Dev Pass
        </button>
        <button
          className="min-h-11 rounded-md border border-amber-400 bg-white px-4 text-sm font-black text-amber-950"
          onClick={() => {
            expireDevPass();
            if (tour) {
              void recordVisitorAnalyticsEvent(tour, "explorer_pass_expired", {
                plan: "free",
                source: "premium_page"
              });
            }
          }}
          type="button"
        >
          Expire Dev Pass
        </button>
      </div>
    </section>
  );
}
