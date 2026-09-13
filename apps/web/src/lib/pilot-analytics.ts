import type { PilotAnalyticsSummary } from "@space-coast-explorer/analytics";

export type PilotTourMetric = PilotAnalyticsSummary & {
  tourTitle: string;
  destinationName: string;
  averageMinutes: number;
  feedbackRating: number;
};

export const pilotTourMetrics: PilotTourMetric[] = [
  {
    destinationId: "cocoa-village",
    tourId: "cocoa-village-historic-explorer",
    tourTitle: "Cocoa Village Historic Explorer",
    destinationName: "Cocoa Village",
    completedVisitorExperiences: 86,
    startedVisitorExperiences: 112,
    manualCompletions: 31,
    gpsCompletions: 55,
    completionRate: 0.7679,
    averageMinutes: 58,
    feedbackRating: 4.6
  },
  {
    destinationId: "cocoa-beach",
    tourId: "cocoa-beach-surf-space-sand",
    tourTitle: "Cocoa Beach: Surf, Space & Sand",
    destinationName: "Cocoa Beach",
    completedVisitorExperiences: 39,
    startedVisitorExperiences: 64,
    manualCompletions: 18,
    gpsCompletions: 21,
    completionRate: 0.6094,
    averageMinutes: 81,
    feedbackRating: 4.2
  },
  {
    destinationId: "port-canaveral",
    tourId: "port-canaveral-explorer",
    tourTitle: "Port Canaveral Explorer",
    destinationName: "Port Canaveral",
    completedVisitorExperiences: 24,
    startedVisitorExperiences: 47,
    manualCompletions: 16,
    gpsCompletions: 8,
    completionRate: 0.5106,
    averageMinutes: 69,
    feedbackRating: 4.0
  }
];

export function getPilotTotals(metrics = pilotTourMetrics) {
  const totals = metrics.reduce(
    (accumulator, metric) => ({
      completedVisitorExperiences:
        accumulator.completedVisitorExperiences + metric.completedVisitorExperiences,
      startedVisitorExperiences:
        accumulator.startedVisitorExperiences + metric.startedVisitorExperiences,
      gpsCompletions: accumulator.gpsCompletions + metric.gpsCompletions,
      manualCompletions: accumulator.manualCompletions + metric.manualCompletions
    }),
    {
      completedVisitorExperiences: 0,
      startedVisitorExperiences: 0,
      gpsCompletions: 0,
      manualCompletions: 0
    }
  );

  return {
    ...totals,
    completionRate:
      totals.startedVisitorExperiences === 0
        ? 0
        : totals.completedVisitorExperiences / totals.startedVisitorExperiences
  };
}

export function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}
